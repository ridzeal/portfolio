'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react'
import { profileSchema, type Profile } from '@/types/profile'
import { seedProfile } from '@/lib/seed-data'

export default function ProfileEditor() {
  const [profile, setProfile] = useState<Profile>(seedProfile)
  const [saved, setSaved] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    summaries: false,
    skills: false,
    experiences: false,
    projects: false,
    education: false,
    roles: false,
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  })

  const {
    fields: summaryFields,
    append: appendSummary,
    remove: removeSummary,
  } = useFieldArray({
    control,
    name: 'summaries',
  })

  const {
    fields: skillCategoryFields,
    append: appendSkillCategory,
    remove: removeSkillCategory,
  } = useFieldArray({
    control,
    name: 'skillCategories',
  })

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: 'experiences',
  })

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: 'projects',
  })

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: 'education',
  })

  const {
    fields: roleProfileFields,
    append: appendRoleProfile,
    remove: removeRoleProfile,
  } = useFieldArray({
    control,
    name: 'roleProfiles',
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const onSubmit = (data: Profile) => {
    // In a real app, this would save to the database
    console.log('Saving profile:', data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </button>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Profile
        </button>
      </div>

      {saved && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Profile saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <SectionHeader title="Personal Information" section="personal" />
          {expandedSections.personal && (
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    {...register('personalInfo.name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  {errors.personalInfo?.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.personalInfo.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    {...register('personalInfo.location')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    {...register('personalInfo.phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    {...register('personalInfo.email')}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn
                  </label>
                  <input
                    {...register('personalInfo.linkedin')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    {...register('personalInfo.website')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline
                </label>
                <input
                  {...register('personalInfo.tagline')}
                  placeholder="e.g., Engineering Manager | Full Stack Developer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Professional Summaries */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <SectionHeader title="Professional Summaries" section="summaries" />
          {expandedSections.summaries && (
            <div className="p-6 space-y-4">
              {summaryFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Summary #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeSummary(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role Type *
                      </label>
                      <select
                        {...register(`summaries.${index}.roleType`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="engineering_manager">Engineering Manager</option>
                        <option value="full_stack_engineer">Full Stack Engineer</option>
                        <option value="backend_engineer">Backend Engineer</option>
                        <option value="frontend_engineer">Frontend Engineer</option>
                        <option value="director_of_engineering">Director of Engineering</option>
                        <option value="project_manager">Project Manager</option>
                        <option value="entrepreneur">Entrepreneur</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Summary Content *
                    </label>
                    <textarea
                      {...register(`summaries.${index}.content`)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendSummary({ roleType: '', content: '' })}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Summary
              </button>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <SectionHeader title="Skills" section="skills" />
          {expandedSections.skills && (
            <div className="p-6 space-y-4">
              {skillCategoryFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Category #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeSkillCategory(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name *
                      </label>
                      <input
                        {...register(`skillCategories.${index}.name`)}
                        placeholder="e.g., programming_languages"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skills (comma-separated) *
                      </label>
                      <input
                        {...register(`skillCategories.${index}.skills`)}
                        placeholder="e.g., Golang, Python, JavaScript"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        onChange={(e) => {
                          const skills = e.target.value.split(',').map((s) => s.trim())
                          e.target.value = skills.join(', ')
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendSkillCategory({ name: '', skills: [''] })}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Skill Category
              </button>
            </div>
          )}
        </div>

        {/* Work Experience */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <SectionHeader title="Work Experience" section="experiences" />
          {expandedSections.experiences && (
            <div className="p-6 space-y-4">
              {experienceFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company *
                      </label>
                      <input
                        {...register(`experiences.${index}.company`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role *
                      </label>
                      <input
                        {...register(`experiences.${index}.role`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        {...register(`experiences.${index}.location`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                      </label>
                      <input
                        {...register(`experiences.${index}.industry`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                      </label>
                      <input
                        {...register(`experiences.${index}.startDate`)}
                        type="month"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date (leave empty for present)
                      </label>
                      <input
                        {...register(`experiences.${index}.endDate`)}
                        type="month"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Achievements (one per line)
                    </label>
                    <input
                      type="hidden"
                      {...register(`experiences.${index}.achievements`)}
                      value={JSON.stringify(profile.experiences[index]?.achievements || [])}
                    />
                    <textarea
                      defaultValue={
                        profile.experiences[index]?.achievements
                          ?.map((a) => a.text)
                          .join('\n') || ''
                      }
                      onBlur={(e) => {
                        const lines = e.target.value.split('\n').filter((l) => l.trim())
                        const experiences = [...profile.experiences]
                        if (experiences[index]) {
                          experiences[index] = {
                            ...experiences[index],
                            achievements: lines.map((text) => ({
                              text,
                              tags: experiences[index].achievements?.find((a) => a.text === text)?.tags || [],
                            })),
                          }
                          setProfile({ ...profile, experiences })
                        }
                      }}
                      rows={4}
                      placeholder="Enter each achievement on a new line"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  appendExperience({
                    company: '',
                    role: '',
                    location: '',
                    startDate: '',
                    endDate: null,
                    type: 'full_time',
                    industry: '',
                    achievements: [],
                    skillsUsed: [],
                  })
                }
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <SectionHeader title="Projects" section="projects" />
          {expandedSections.projects && (
            <div className="p-6 space-y-4">
              {projectFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Project #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Name *
                      </label>
                      <input
                        {...register(`projects.${index}.name`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input
                        {...register(`projects.${index}.role`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register(`projects.${index}.description`)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  appendProject({
                    name: '',
                    description: '',
                    role: '',
                    skills: [],
                    tags: [],
                  })
                }
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>
          )}
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <SectionHeader title="Education" section="education" />
          {expandedSections.education && (
            <div className="p-6 space-y-4">
              {educationFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree *
                      </label>
                      <input
                        {...register(`education.${index}.degree`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution *
                      </label>
                      <input
                        {...register(`education.${index}.institution`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        {...register(`education.${index}.location`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Graduation Date
                      </label>
                      <input
                        {...register(`education.${index}.graduationDate`)}
                        type="month"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  appendEducation({
                    degree: '',
                    institution: '',
                    location: '',
                    graduationDate: '',
                  })
                }
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>
          )}
        </div>

        {/* Role Profiles */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <SectionHeader title="Role Profiles" section="roles" />
          {expandedSections.roles && (
            <div className="p-6 space-y-4">
              {roleProfileFields.map((field, index) => (
                <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Role Profile #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeRoleProfile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role Name *
                      </label>
                      <input
                        {...register(`roleProfiles.${index}.name`)}
                        placeholder="e.g., engineering_manager"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name *
                      </label>
                      <input
                        {...register(`roleProfiles.${index}.displayName`)}
                        placeholder="e.g., Engineering Manager"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Summary Key *
                      </label>
                      <input
                        {...register(`roleProfiles.${index}.summaryKey`)}
                        placeholder="References professional summary role type"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Experience Items
                      </label>
                      <input
                        {...register(`roleProfiles.${index}.maxExperienceItems`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        min={1}
                        max={20}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  appendRoleProfile({
                    name: '',
                    displayName: '',
                    summaryKey: '',
                    highlightSkills: [],
                    experienceFilter: [],
                    excludeSkills: [],
                    maxExperienceItems: 100,
                  })
                }
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Role Profile
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
