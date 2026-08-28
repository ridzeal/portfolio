import type { Profile, RoleProfile, WorkExperience } from '@/types/profile'

// Filter and sort experiences based on role profile
function filterExperiences(
  experiences: WorkExperience[],
  roleProfile: RoleProfile
): WorkExperience[] {
  // Filter individual achievements within each experience based on role tags
  let filtered = experiences.map((exp) => {
    if (!roleProfile.experienceFilter || roleProfile.experienceFilter.length === 0) {
      return exp
    }

    // Filter achievements that match the role's experience filter tags
    const filteredAchievements = exp.achievements?.filter((achievement) =>
      achievement.tags?.some((tag) =>
        roleProfile.experienceFilter!.includes(tag)
      )
    ) || []

    return {
      ...exp,
      achievements: filteredAchievements,
    }
  })

  // Exclude experiences with excluded skills
  if (roleProfile.excludeSkills && roleProfile.excludeSkills.length > 0) {
    filtered = filtered.filter((exp) =>
      !exp.skillsUsed?.some((skill) =>
        roleProfile.excludeSkills!.includes(skill)
      )
    )
  }

  // Remove experiences with no matching achievements
  filtered = filtered.filter((exp) => exp.achievements && exp.achievements.length > 0)

  // Sort by start date (most recent first)
  filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  // Limit by max experience items
  if (roleProfile.maxExperienceItems) {
    filtered = filtered.slice(0, roleProfile.maxExperienceItems)
  }

  return filtered
}

// Filter skills based on role profile
function filterSkills(
  skillCategories: Profile['skillCategories'],
  roleProfile: RoleProfile
): Profile['skillCategories'] {
  // If no highlight skills specified, return all
  if (!roleProfile.highlightSkills || roleProfile.highlightSkills.length === 0) {
    return skillCategories
  }

  return skillCategories
    .map((category) => ({
      ...category,
      skills: category.skills.filter((skill) =>
        roleProfile.highlightSkills!.includes(skill)
      ),
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
  const filteredExperiences = filterExperiences(profile.experiences, roleProfile)
  const filteredSkills = filterSkills(profile.skillCategories, roleProfile)
  const summary = getSummary(profile.summaries, roleProfile)

  return {
    personalInfo: profile.personalInfo,
    summary,
    skills: filteredSkills,
    experiences: filteredExperiences.map((exp) => ({
      company: exp.company,
      role: exp.role,
      location: exp.location,
      dateRange: `${formatDate(exp.startDate)} – ${formatDate(exp.endDate)}`,
      achievements: exp.achievements?.map((a) => a.text) || [],
    })),
    projects: profile.projects,
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

  // Find most relevant summary (prefer engineering_manager, then full_stack_engineer, then first)
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

  // Get most recent experiences
  const recentExperiences = [...profile.experiences]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3)

  // Get relevant skills
  const allSkills = profile.skillCategories
    .flatMap((cat) => cat.skills)
    .slice(0, 8)

  // Build key points from achievements if not provided
  const points = keyPoints || recentExperiences
    .flatMap((exp) => (exp.achievements?.slice(0, 2).map((a) => a.text) || []))
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
