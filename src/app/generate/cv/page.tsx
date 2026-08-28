'use client'

import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { seedProfile } from '@/lib/seed-data'
import { generateCV } from '@/lib/cv-generator'
import type { RoleProfile } from '@/types/profile'

export default function CVGenerator() {
  const [selectedRole, setSelectedRole] = useState<RoleProfile | null>(null)
  const [cvContent, setCVContent] = useState<ReturnType<typeof generateCV> | null>(null)

  const handleRoleSelect = (roleName: string) => {
    const role = seedProfile.roleProfiles.find((r) => r.name === roleName)
    if (role) {
      setSelectedRole(role)
      const cv = generateCV(seedProfile, role)
      setCVContent(cv)
    }
  }

  const handleDownload = () => {
    if (!cvContent) return

    // Create a simple text version of the CV
    const text = `
${cvContent.personalInfo.name}
${cvContent.personalInfo.location || ''}
${cvContent.personalInfo.phone || ''}
${cvContent.personalInfo.email || ''}
${cvContent.personalInfo.linkedin || ''}

PROFESSIONAL SUMMARY
${cvContent.summary}

TECHNICAL SKILLS
${cvContent.skills.map((cat) => `${cat.name.replace(/_/g, ' ').toUpperCase()}: ${cat.skills.join(', ')}`).join('\n')}

PROFESSIONAL EXPERIENCE
${cvContent.experiences
  .map(
    (exp) => `
${exp.role}
${exp.company} · ${exp.location || ''} · ${exp.dateRange}
${exp.achievements.map((a) => `• ${a}`).join('\n')}
`
  )
  .join('\n')}

EDUCATION
${cvContent.education
  .map(
    (ed) => `
${ed.degree}
${ed.institution} · ${ed.location || ''} · ${ed.graduationDate || ''}
`
  )
  .join('\n')}
`

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `CV_${selectedRole?.displayName?.replace(/\s+/g, '_') || 'Generated'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Generate CV</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Role Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Role Type</h2>
            <div className="space-y-2">
              {seedProfile.roleProfiles.map((role) => (
                <button
                  key={role.name}
                  onClick={() => handleRoleSelect(role.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedRole?.name === role.name
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{role.displayName}</div>
                  <div className="text-sm opacity-75">
                    {role.maxExperienceItems} experiences max
                  </div>
                </button>
              ))}
            </div>

            {selectedRole && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Role Configuration</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">Highlight Skills:</span>{' '}
                    {selectedRole.highlightSkills?.join(', ') || 'None'}
                  </div>
                  <div>
                    <span className="font-medium">Experience Filter:</span>{' '}
                    {selectedRole.experienceFilter?.join(', ') || 'All'}
                  </div>
                  <div>
                    <span className="font-medium">Exclude Skills:</span>{' '}
                    {selectedRole.excludeSkills?.join(', ') || 'None'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CV Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">CV Preview</h2>
              {cvContent && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>

            {!cvContent ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a role type to generate a tailored CV</p>
              </div>
            ) : (
              <div className="prose max-w-none">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {cvContent.personalInfo.name}
                  </h1>
                  <div className="text-gray-600 mt-2">
                    {cvContent.personalInfo.location && (
                      <span>{cvContent.personalInfo.location}</span>
                    )}
                    {cvContent.personalInfo.phone && (
                      <span> · {cvContent.personalInfo.phone}</span>
                    )}
                    {cvContent.personalInfo.email && (
                      <span> · {cvContent.personalInfo.email}</span>
                    )}
                    {cvContent.personalInfo.linkedin && (
                      <span> · {cvContent.personalInfo.linkedin}</span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {cvContent.summary && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
                      PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-gray-700">{cvContent.summary}</p>
                  </div>
                )}

                {/* Skills */}
                {cvContent.skills.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
                      TECHNICAL SKILLS
                    </h2>
                    <div className="space-y-2">
                      {cvContent.skills.map((category) => (
                        <div key={category.name}>
                          <span className="font-medium text-gray-900">
                            {category.name.replace(/_/g, ' ').toUpperCase()}:
                          </span>{' '}
                          <span className="text-gray-700">{category.skills.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {cvContent.experiences.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
                      PROFESSIONAL EXPERIENCE
                    </h2>
                    <div className="space-y-6">
                      {cvContent.experiences.map((exp, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                              <div className="text-gray-600">
                                {exp.company}
                                {exp.location && ` · ${exp.location}`}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">{exp.dateRange}</div>
                          </div>
                          {exp.achievements.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {exp.achievements.map((achievement, i) => (
                                <li key={i} className="text-gray-700 flex">
                                  <span className="mr-2">•</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {cvContent.projects.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
                      PROJECTS
                    </h2>
                    <div className="space-y-4">
                      {cvContent.projects.map((project, index) => (
                        <div key={index}>
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          {project.role && (
                            <div className="text-gray-600">{project.role}</div>
                          )}
                          {project.description && (
                            <p className="text-gray-700 mt-1">{project.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {cvContent.education.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-3">
                      EDUCATION
                    </h2>
                    <div className="space-y-4">
                      {cvContent.education.map((edu, index) => (
                        <div key={index}>
                          <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                          <div className="text-gray-600">
                            {edu.institution}
                            {edu.location && ` · ${edu.location}`}
                            {edu.graduationDate && ` · ${edu.graduationDate}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
