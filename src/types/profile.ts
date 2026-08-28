import { z } from 'zod'

// Personal Information Schema
export const personalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  linkedin: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  tagline: z.string().optional(),
})

export type PersonalInfo = z.infer<typeof personalInfoSchema>

// Professional Summary Schema
export const summarySchema = z.object({
  roleType: z.string().min(1, 'Role type is required'),
  content: z.string().min(10, 'Summary must be at least 10 characters'),
})

export type Summary = z.infer<typeof summarySchema>

// Skill Category Schema
export const skillCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
})

export type SkillCategory = z.infer<typeof skillCategorySchema>

// Achievement Schema
export const achievementSchema = z.object({
  text: z.string().min(1, 'Achievement text is required'),
  tags: z.array(z.string()).optional(),
})

export type Achievement = z.infer<typeof achievementSchema>

// Work Experience Schema
export const workExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  type: z.enum(['full_time', 'contract', 'freelance']).optional(),
  industry: z.string().optional(),
  achievements: z.array(achievementSchema).optional(),
  skillsUsed: z.array(z.string()).optional(),
})

export type WorkExperience = z.infer<typeof workExperienceSchema>

// Project Schema
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  role: z.string().optional(),
  skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

export type Project = z.infer<typeof projectSchema>

// Education Schema
export const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  location: z.string().optional(),
  graduationDate: z.string().optional(),
})

export type Education = z.infer<typeof educationSchema>

// Role Profile Schema
export const roleProfileSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  summaryKey: z.string().min(1, 'Summary key is required'),
  highlightSkills: z.array(z.string()).optional(),
  experienceFilter: z.array(z.string()).optional(),
  excludeSkills: z.array(z.string()).optional(),
  maxExperienceItems: z.number().min(1).max(20),
})

export type RoleProfile = z.infer<typeof roleProfileSchema>

// Complete Profile Schema
export const profileSchema = z.object({
  personalInfo: personalInfoSchema,
  summaries: z.array(summarySchema),
  skillCategories: z.array(skillCategorySchema),
  experiences: z.array(workExperienceSchema),
  projects: z.array(projectSchema),
  education: z.array(educationSchema),
  roleProfiles: z.array(roleProfileSchema),
})

export type Profile = z.infer<typeof profileSchema>

// CV Generation Request
export const cvGenerationRequestSchema = z.object({
  roleProfileId: z.string().min(1, 'Role profile is required'),
  customHighlights: z.array(z.string()).optional(),
  maxExperienceItems: z.number().min(1).max(20).optional(),
})

export type CVGenerationRequest = z.infer<typeof cvGenerationRequestSchema>

// Cover Letter Generation Request
export const coverLetterRequestSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  hiringManager: z.string().optional(),
  keyPoints: z.array(z.string()).optional(),
  additionalNotes: z.string().optional(),
})

export type CoverLetterRequest = z.infer<typeof coverLetterRequestSchema>
