import type { Profile, RoleProfile, Company, Position } from '@/types/profile'

// Flatten companies into individual positions for CV generation
function flattenPositions(companies: Company[]): (Position & { company: string; companyIndustry?: string; companyHqLocation?: string })[] {
  return companies.flatMap((c) =>
    c.positions.map((p) => ({
      ...p,
      company: c.name,
      companyIndustry: c.industry,
      companyHqLocation: c.hqLocation,
    }))
  )
}

// Filter and sort positions based on role profile
function filterPositions(
  companies: Company[],
  roleProfile: RoleProfile
): ReturnType<typeof flattenPositions> {
  let flat = flattenPositions(companies)

  // Filter individual achievements within each position based on role tags
  flat = flat.map((pos) => {
    if (!roleProfile.experienceFilter || roleProfile.experienceFilter.length === 0) {
      return pos
    }
    const filteredAchievements = pos.achievements?.filter((achievement) =>
      achievement.tags?.some((tag) => roleProfile.experienceFilter!.includes(tag))
    ) || []
    return { ...pos, achievements: filteredAchievements }
  })

  // Exclude positions with excluded skills
  if (roleProfile.excludeSkills && roleProfile.excludeSkills.length > 0) {
    flat = flat.filter((pos) =>
      !pos.skillsUsed?.some((skill) => roleProfile.excludeSkills!.includes(skill))
    )
  }

  // Remove positions with no matching achievements
  flat = flat.filter((pos) => pos.achievements && pos.achievements.length > 0)

  // Sort by start date (most recent first)
  flat.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  // Limit by max experience items
  if (roleProfile.maxExperienceItems) {
    flat = flat.slice(0, roleProfile.maxExperienceItems)
  }

  return flat
}

// Filter skills based on role profile
function filterSkills(
  skillCategories: Profile['skillCategories'],
  roleProfile: RoleProfile
): Profile['skillCategories'] {
  if (!roleProfile.highlightSkills || roleProfile.highlightSkills.length === 0) {
    return skillCategories
  }
  return skillCategories
    .map((category) => ({
      ...category,
      skills: category.skills.filter((skill) => roleProfile.highlightSkills!.includes(skill)),
    }))
    .filter((category) => category.skills.length > 0)
}

// Get summary for role
function getSummary(
  summaries: Profile['summaries'],
  roleProfile: RoleProfile
): string {
  const summary = summaries.find((s) => s.roleType === roleProfile.summaryKey)
  return summary?.content || ''
}

// Format date for display
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Present'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// Generate CV content based on role profile
export function generateCV(profile: Profile, roleProfile: RoleProfile) {
  const filteredPositions = filterPositions(profile.companies, roleProfile)
  const filteredSkills = filterSkills(profile.skillCategories, roleProfile)
  const summary = getSummary(profile.summaries, roleProfile)

  return {
    personalInfo: profile.personalInfo,
    summary,
    skills: filteredSkills,
    experiences: filteredPositions.map((pos) => ({
      company: pos.company,
      role: pos.role,
      location: pos.myLocation || pos.companyHqLocation,
      workArrangement: pos.workArrangement,
      dateRange: `${formatDate(pos.startDate)} – ${formatDate(pos.endDate)}`,
      achievements: pos.achievements?.map((a) => a.text) || [],
    })),
    projects: profile.projects,
    products: profile.products,
    education: profile.education,
  }
}

// Generate cover letter content
export function generateCoverLetter(
  profile: Profile,
  companyName: string,
  jobTitle: string,
  hiringManager?: string,
  keyPoints?: string[]
) {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const summaryPriority = ['engineering_manager', 'full_stack_engineer', 'backend_engineer']
  let summary = ''
  for (const roleType of summaryPriority) {
    const found = profile.summaries.find((s) => s.roleType === roleType)
    if (found) {
      summary = found.content
      break
    }
  }
  if (!summary && profile.summaries.length > 0) {
    summary = profile.summaries[0].content
  }

  // Get most recent positions
  const allPositions = flattenPositions(profile.companies)
  const recentPositions = allPositions
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3)

  const allSkills = profile.skillCategories
    .flatMap((cat) => cat.skills)
    .slice(0, 8)

  const points = keyPoints || recentPositions
    .flatMap((pos) => (pos.achievements?.slice(0, 2).map((a) => a.text) || []))
    .slice(0, 4)

  return {
    date: today,
    sender: {
      name: profile.personalInfo.name,
      location: profile.personalInfo.location,
      phone: profile.personalInfo.phone,
      email: profile.personalInfo.email,
      linkedin: profile.personalInfo.linkedin,
    },
    recipient: {
      hiringManager: hiringManager || 'Hiring Manager',
      company: companyName,
    },
    jobTitle,
    opening: `I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. ${summary}`,
    keyPoints: points,
    skills: allSkills,
    closing: `I am excited about the opportunity to bring my experience and skills to ${companyName}. I would welcome the chance to discuss how I can contribute to your team's success.`,
  }
}
