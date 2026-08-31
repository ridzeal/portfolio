import { prisma } from './db'
import type { Profile, Company, Position } from '@/types/profile'

// Get profile by user ID
export async function getProfile(userId: string): Promise<Profile | null> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      summaries: true,
      skillCategories: {
        include: { skills: true },
      },
      experiences: {
        include: {
          achievements: {
            include: { tags: true },
          },
          skillsUsed: true,
        },
        orderBy: { startDate: 'desc' },
      },
      projects: {
        include: {
          skills: true,
          tags: true,
        },
      },
      education: {
        orderBy: { graduationDate: 'desc' },
      },
      roleProfiles: {
        include: { skills: true },
      },
    },
  })

  if (!profile) return null

  // Group flat experiences into company-nested positions
  const companyMap = new Map<string, Company>()
  for (const e of profile.experiences) {
    const existing = companyMap.get(e.company)
    const position: Position = {
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
      existing.positions.push(position)
    } else {
      companyMap.set(e.company, {
        name: e.company,
        industry: e.industry || undefined,
        hqLocation: e.location || undefined,
        positions: [position],
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
    summaries: profile.summaries.map((s) => ({
      roleType: s.roleType,
      content: s.content,
    })),
    skillCategories: profile.skillCategories.map((sc) => ({
      name: sc.name,
      skills: sc.skills.map((s) => s.name),
    })),
    companies: Array.from(companyMap.values()),
    projects: profile.projects.map((p) => ({
      name: p.name,
      description: p.description || undefined,
      role: p.role || undefined,
      skills: p.skills.map((s) => s.name),
      tags: p.tags.map((t) => t.name),
    })),
    products: [],
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

// Create or update profile
// NOTE: This currently uses the flat Prisma schema. When the schema is migrated
// to support company-nested positions, this will need updating.
export async function upsertProfile(userId: string, data: Profile): Promise<void> {
  const profile = await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      name: data.personalInfo.name,
      location: data.personalInfo.location,
      phone: data.personalInfo.phone,
      email: data.personalInfo.email,
      linkedin: data.personalInfo.linkedin,
      website: data.personalInfo.website,
      tagline: data.personalInfo.tagline,
    },
    update: {
      name: data.personalInfo.name,
      location: data.personalInfo.location,
      phone: data.personalInfo.phone,
      email: data.personalInfo.email,
      linkedin: data.personalInfo.linkedin,
      website: data.personalInfo.website,
      tagline: data.personalInfo.tagline,
    },
  })

  // Delete and recreate summaries
  await prisma.professionalSummary.deleteMany({ where: { profileId: profile.id } })
  await prisma.professionalSummary.createMany({
    data: data.summaries.map((s) => ({
      profileId: profile.id,
      roleType: s.roleType,
      content: s.content,
    })),
  })

  // Delete and recreate skill categories
  for (const category of data.skillCategories) {
    const existingCategory = await prisma.skillCategory.findFirst({
      where: { profileId: profile.id, name: category.name },
    })
    if (existingCategory) {
      await prisma.skill.deleteMany({ where: { categoryId: existingCategory.id } })
      await prisma.skill.createMany({
        data: category.skills.map((skill) => ({
          categoryId: existingCategory.id,
          name: skill,
        })),
      })
    } else {
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
  }

  // Flatten companies back to experiences for Prisma storage
  await prisma.workExperience.deleteMany({ where: { profileId: profile.id } })
  for (const company of data.companies) {
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
  for (const project of data.projects) {
    await prisma.project.create({
      data: {
        profileId: profile.id,
        name: project.name,
        description: project.description,
        role: project.role,
        skills: {
          create: (project.skills || []).map((skill) => ({ name: skill })),
        },
        tags: {
          create: (project.tags || []).map((tag) => ({ name: tag })),
        },
      },
    })
  }

  // Delete and recreate education
  await prisma.education.deleteMany({ where: { profileId: profile.id } })
  await prisma.education.createMany({
    data: data.education.map((ed) => ({
      profileId: profile.id,
      degree: ed.degree,
      institution: ed.institution,
      location: ed.location,
      graduationDate: ed.graduationDate ? new Date(ed.graduationDate) : null,
    })),
  })

  // Delete and recreate role profiles
  await prisma.roleProfile.deleteMany({ where: { profileId: profile.id } })
  for (const roleProfile of data.roleProfiles) {
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
}
