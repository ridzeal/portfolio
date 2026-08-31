'use server'

import { prisma } from '@/lib/db'
import type { Profile, Company } from '@/types/profile'
import { profileSchema } from '@/types/profile'

const DEFAULT_EMAIL = 'ridzeal@gmail.com'

async function getOrCreateDefaultUser() {
  let user = await prisma.user.findUnique({ where: { email: DEFAULT_EMAIL } })
  if (!user) {
    user = await prisma.user.create({
      data: { email: DEFAULT_EMAIL, name: 'Riadhi Aditya Hermawan' },
    })
  }
  return user
}

export async function saveProfile(data: Profile) {
  const parsed = profileSchema.parse(data)
  const user = await getOrCreateDefaultUser()

  // Upsert profile
  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      name: parsed.personalInfo.name,
      location: parsed.personalInfo.location,
      phone: parsed.personalInfo.phone,
      email: parsed.personalInfo.email,
      linkedin: parsed.personalInfo.linkedin,
      website: parsed.personalInfo.website,
      tagline: parsed.personalInfo.tagline,
    },
    update: {
      name: parsed.personalInfo.name,
      location: parsed.personalInfo.location,
      phone: parsed.personalInfo.phone,
      email: parsed.personalInfo.email,
      linkedin: parsed.personalInfo.linkedin,
      website: parsed.personalInfo.website,
      tagline: parsed.personalInfo.tagline,
    },
  })

  // Delete and recreate summaries
  await prisma.professionalSummary.deleteMany({ where: { profileId: profile.id } })
  if (parsed.summaries.length > 0) {
    await prisma.professionalSummary.createMany({
      data: parsed.summaries.map((s) => ({
        profileId: profile.id,
        roleType: s.roleType,
        content: s.content,
      })),
    })
  }

  // Delete and recreate skill categories
  await prisma.skillCategory.deleteMany({ where: { profileId: profile.id } })
  for (const category of parsed.skillCategories) {
    await prisma.skillCategory.create({
      data: {
        profileId: profile.id,
        name: category.name,
        skills: {
          create: category.skills.map((skill) => ({ name: skill })),
        },
      },
    })
  }

  // Delete and recreate experiences (flatten companies → positions)
  await prisma.workExperience.deleteMany({ where: { profileId: profile.id } })
  for (const company of parsed.companies) {
    for (const position of company.positions) {
      await prisma.workExperience.create({
        data: {
          profileId: profile.id,
          company: company.name,
          role: position.role,
          location: position.myLocation || company.hqLocation,
          startDate: new Date(position.startDate),
          endDate: position.endDate ? new Date(position.endDate) : null,
          type: 'full_time',
          industry: company.industry,
          achievements: {
            create: (position.achievements || []).map((a) => ({
              text: a.text,
              tags: {
                create: (a.tags || []).map((tag) => ({ name: tag })),
              },
            })),
          },
          skillsUsed: {
            create: (position.skillsUsed || []).map((skill) => ({ name: skill })),
          },
        },
      })
    }
  }

  // Delete and recreate projects
  await prisma.project.deleteMany({ where: { profileId: profile.id } })
  for (const project of parsed.projects) {
    await prisma.project.create({
      data: {
        profileId: profile.id,
        name: project.name,
        description: project.description,
        role: project.role,
        startDate: project.startDate || null,
        endDate: project.endDate || null,
        skills: {
          create: (project.skills || []).map((skill) => ({ name: skill })),
        },
        tags: {
          create: (project.tags || []).map((tag) => ({ name: tag })),
        },
      },
    })
  }

  // Delete and recreate products
  await prisma.product.deleteMany({ where: { profileId: profile.id } })
  for (const product of parsed.products) {
    await prisma.product.create({
      data: {
        profileId: profile.id,
        name: product.name,
        description: product.description,
        url: product.url,
        logo: product.logo,
        startDate: product.startDate || null,
        endDate: product.endDate || null,
        skills: {
          create: (product.skills || []).map((skill) => ({ name: skill })),
        },
        tags: {
          create: (product.tags || []).map((tag) => ({ name: tag })),
        },
      },
    })
  }

  // Delete and recreate education
  await prisma.education.deleteMany({ where: { profileId: profile.id } })
  if (parsed.education.length > 0) {
    await prisma.education.createMany({
      data: parsed.education.map((ed) => ({
        profileId: profile.id,
        degree: ed.degree,
        institution: ed.institution,
        location: ed.location,
        graduationDate: ed.graduationDate ? new Date(ed.graduationDate) : null,
      })),
    })
  }

  // Delete and recreate role profiles
  await prisma.roleProfile.deleteMany({ where: { profileId: profile.id } })
  for (const roleProfile of parsed.roleProfiles) {
    await prisma.roleProfile.create({
      data: {
        profileId: profile.id,
        name: roleProfile.name,
        displayName: roleProfile.displayName,
        summaryKey: roleProfile.summaryKey,
        maxExperienceItems: roleProfile.maxExperienceItems,
        skills: {
          create: [
            ...(roleProfile.highlightSkills || []).map((skill) => ({
              name: skill,
              type: 'highlight',
            })),
            ...(roleProfile.experienceFilter || []).map((skill) => ({
              name: skill,
              type: 'filter',
            })),
            ...(roleProfile.excludeSkills || []).map((skill) => ({
              name: skill,
              type: 'exclude',
            })),
          ],
        },
      },
    })
  }

  return { success: true }
}

export async function loadProfile(): Promise<Profile | null> {
  const user = await prisma.user.findUnique({ where: { email: DEFAULT_EMAIL } })
  if (!user) return null

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      summaries: true,
      skillCategories: { include: { skills: true } },
      experiences: {
        include: {
          achievements: { include: { tags: true } },
          skillsUsed: true,
        },
        orderBy: { startDate: 'desc' },
      },
      projects: { include: { skills: true, tags: true } },
      products: { include: { skills: true, tags: true } },
      education: { orderBy: { graduationDate: 'desc' } },
      roleProfiles: { include: { skills: true } },
    },
  })

  if (!profile) return null

  // Group flat experiences into company-nested positions
  const companyMap = new Map<string, Company>()
  for (const e of profile.experiences) {
    const existing = companyMap.get(e.company)
    const pos = {
      role: e.role,
      startDate: e.startDate.toISOString().split('T')[0],
      endDate: e.endDate?.toISOString().split('T')[0] || null,
      myLocation: e.location || undefined,
      achievements: e.achievements.map((a) => ({
        text: a.text,
        tags: a.tags.map((t) => t.name),
      })),
      skillsUsed: e.skillsUsed.map((s) => s.name),
    }
    if (existing) {
      existing.positions.push(pos)
    } else {
      companyMap.set(e.company, {
        name: e.company,
        industry: e.industry || undefined,
        hqLocation: e.location || undefined,
        positions: [pos],
      })
    }
  }

  return {
    personalInfo: {
      name: profile.name,
      location: profile.location || undefined,
      phone: profile.phone || undefined,
      email: profile.email || undefined,
      linkedin: profile.linkedin || undefined,
      website: profile.website || undefined,
      tagline: profile.tagline || undefined,
    },
    summaries: profile.summaries.map((s) => ({ roleType: s.roleType, content: s.content })),
    skillCategories: profile.skillCategories.map((sc) => ({
      name: sc.name,
      skills: sc.skills.map((s) => s.name),
    })),
    companies: Array.from(companyMap.values()),
    projects: profile.projects.map((p) => ({
      name: p.name,
      description: p.description || undefined,
      role: p.role || undefined,
      startDate: p.startDate || undefined,
      endDate: p.endDate || undefined,
      skills: p.skills.map((s) => s.name),
      tags: p.tags.map((t) => t.name),
    })),
    products: (profile.products || []).map((p) => ({
      name: p.name,
      description: p.description || undefined,
      url: p.url || undefined,
      logo: p.logo || undefined,
      startDate: p.startDate || undefined,
      endDate: p.endDate || undefined,
      skills: p.skills.map((s) => s.name),
      tags: p.tags.map((t) => t.name),
    })),
    education: profile.education.map((ed) => ({
      degree: ed.degree,
      institution: ed.institution,
      location: ed.location || undefined,
      graduationDate: ed.graduationDate?.toISOString().split('T')[0] || undefined,
    })),
    roleProfiles: profile.roleProfiles.map((rp) => ({
      name: rp.name,
      displayName: rp.displayName,
      summaryKey: rp.summaryKey,
      highlightSkills: rp.skills.filter((s) => s.type === 'highlight').map((s) => s.name),
      experienceFilter: rp.skills.filter((s) => s.type === 'filter').map((s) => s.name),
      excludeSkills: rp.skills.filter((s) => s.type === 'exclude').map((s) => s.name),
      maxExperienceItems: rp.maxExperienceItems,
    })),
  }
}
