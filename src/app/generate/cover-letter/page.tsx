'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Download, Mail } from 'lucide-react'
import { seedProfile } from '@/lib/seed-data'
import { generateCoverLetter } from '@/lib/cv-generator'
import { coverLetterRequestSchema, type CoverLetterRequest } from '@/types/profile'

export default function CoverLetterGenerator() {
  const [letterContent, setLetterContent] = useState<ReturnType<typeof generateCoverLetter> | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoverLetterRequest>({
    resolver: zodResolver(coverLetterRequestSchema),
    defaultValues: {
      companyName: '',
      jobTitle: '',
      hiringManager: '',
      keyPoints: [],
      additionalNotes: '',
    },
  })

  const onSubmit = (data: CoverLetterRequest) => {
    const letter = generateCoverLetter(
      seedProfile,
      data.companyName,
      data.jobTitle,
      data.hiringManager,
      data.keyPoints
    )
    setLetterContent(letter)
  }

  const handleDownload = () => {
    if (!letterContent) return

    const text = `
${letterContent.sender.name}
${letterContent.sender.location || ''}
${letterContent.sender.phone || ''}
${letterContent.sender.email || ''}
${letterContent.sender.linkedin || ''}

${letterContent.date}

${letterContent.recipient.hiringManager}
${letterContent.recipient.company}

Dear ${letterContent.recipient.hiringManager},

${letterContent.opening}

${letterContent.keyPoints.length > 0 ? `
Key highlights of my relevant experience include:
${letterContent.keyPoints.map((point) => `• ${point}`).join('\n')}
` : ''}

${letterContent.closing}

Sincerely,
${letterContent.sender.name}
`

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Cover_Letter_${letterContent.recipient.company.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Generate Cover Letter</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company & Role Info</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  {...register('companyName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="e.g., Okadoc"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  {...register('jobTitle')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="e.g., Engineering Manager"
                />
                {errors.jobTitle && (
                  <p className="mt-1 text-sm text-red-600">{errors.jobTitle.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hiring Manager (optional)
                </label>
                <input
                  {...register('hiringManager')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="e.g., John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (optional)
                </label>
                <textarea
                  {...register('additionalNotes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Any specific points you want to mention..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Generate Letter
              </button>
            </form>

            {/* Key Points Selection */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Key Points to Mention</h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Healthcare experience</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Team leadership</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>UAE/Middle East experience</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>ERP background</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Startup experience</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
              {letterContent && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>

            {!letterContent ? (
              <div className="text-center py-12 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Fill in the company and role info to generate a cover letter</p>
              </div>
            ) : (
              <div className="prose max-w-none">
                {/* Header */}
                <div className="mb-6">
                  <div className="text-gray-900 font-medium">{letterContent.sender.name}</div>
                  {letterContent.sender.location && (
                    <div className="text-gray-600">{letterContent.sender.location}</div>
                  )}
                  {letterContent.sender.phone && (
                    <div className="text-gray-600">{letterContent.sender.phone}</div>
                  )}
                  {letterContent.sender.email && (
                    <div className="text-gray-600">{letterContent.sender.email}</div>
                  )}
                  {letterContent.sender.linkedin && (
                    <div className="text-gray-600">{letterContent.sender.linkedin}</div>
                  )}
                </div>

                {/* Date */}
                <div className="text-gray-900 mb-6">{letterContent.date}</div>

                {/* Recipient */}
                <div className="mb-6">
                  <div className="text-gray-900">{letterContent.recipient.hiringManager}</div>
                  <div className="text-gray-900">{letterContent.recipient.company}</div>
                </div>

                {/* Salutation */}
                <div className="text-gray-900 mb-4">
                  Dear {letterContent.recipient.hiringManager},
                </div>

                {/* Opening */}
                <p className="text-gray-700 mb-4">{letterContent.opening}</p>

                {/* Key Points */}
                {letterContent.keyPoints.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-700 mb-2">
                      Key highlights of my relevant experience include:
                    </p>
                    <ul className="space-y-1">
                      {letterContent.keyPoints.map((point, index) => (
                        <li key={index} className="text-gray-700 flex">
                          <span className="mr-2">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Closing */}
                <p className="text-gray-700 mb-6">{letterContent.closing}</p>

                {/* Signature */}
                <div className="text-gray-900">Sincerely,</div>
                <div className="text-gray-900 font-medium">{letterContent.sender.name}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
