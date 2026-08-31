'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useForm, useFieldArray, type Control, type UseFormRegister, type FieldErrors, type ArrayPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Save, X } from 'lucide-react'
import { profileSchema, type Profile } from '@/types/profile'
import { seedProfile } from '@/lib/seed-data'
import { saveProfile, loadProfile } from './actions'

// ─── Pill Input Component ────────────────────────────────────────────────────

function PillInput({
  pills,
  suggestions,
  onAdd,
  onRemove,
  placeholder,
}: {
  pills: string[]
  suggestions?: string[]
  onAdd: (value: string) => void
  onRemove: (index: number) => void
  placeholder?: string
}) {
  const [input, setInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions = useMemo(() => {
    if (!suggestions || !input.trim()) return []
    const query = input.trim().toLowerCase()
    return suggestions
      .filter(
        (s) =>
          s.toLowerCase().includes(query) &&
          !pills.some((p) => p.toLowerCase() === s.toLowerCase())
      )
      .slice(0, 8)
  }, [suggestions, input, pills])

  useEffect(() => {
    setHighlightedIndex(-1)
  }, [input])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addValue = (val: string) => {
    const trimmed = val.trim()
    if (trimmed && !pills.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      onAdd(trimmed)
    }
    setInput('')
    setShowDropdown(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Read from DOM to avoid stale React state from batched updates
    const currentValue = inputRef.current?.value || input
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
        addValue(filteredSuggestions[highlightedIndex])
      } else {
        addValue(currentValue)
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    } else if (e.key === 'Backspace' && !input && pills.length > 0) {
      onRemove(pills.length - 1)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent min-h-[42px] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {pills.map((pill, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
          >
            {pill}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(i)
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => input.trim() && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={pills.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
        />
      </div>
      {showDropdown && filteredSuggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, i) => (
            <li
              key={suggestion}
              onMouseDown={(e) => {
                e.preventDefault()
                addValue(suggestion)
              }}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`px-3 py-2 text-sm cursor-pointer ${
                i === highlightedIndex ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Achievement List Component ──────────────────────────────────────────────

function AchievementList({
  control,
  register,
  companyIndex,
  positionIndex,
}: {
  control: Control<Profile>
  register: UseFormRegister<Profile>
  companyIndex: number
  positionIndex: number
}) {
  const path = `companies.${companyIndex}.positions.${positionIndex}.achievements` as ArrayPath<Profile>
  const { fields, append, remove } = useFieldArray({ control, name: path })

  return (
    <div className="space-y-2">
      {fields.map((field, i) => (
        <div key={field.id} className="flex items-start gap-2">
          <span className="mt-2 text-gray-400 text-sm select-none">{i + 1}.</span>
          <input
            {...register(`${path}.${i}.text` as any)}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Describe an achievement..."
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="mt-1.5 text-gray-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ text: '' })}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add achievement
      </button>
    </div>
  )
}

// ─── Position Card ───────────────────────────────────────────────────────────

function PositionCard({
  companyIndex,
  positionIndex,
  control,
  register,
  getValues,
  setValue,
  errors,
  onRemove,
}: {
  companyIndex: number
  positionIndex: number
  control: Control<Profile>
  register: UseFormRegister<Profile>
  getValues: ReturnType<typeof useForm<Profile>>['getValues']
  setValue: ReturnType<typeof useForm<Profile>>['setValue']
  errors: FieldErrors<Profile>
  onRemove: () => void
}) {
  const p = (field: string) => `companies.${companyIndex}.positions.${positionIndex}.${field}` as any
  const posErrors = (errors.companies as any)?.[companyIndex]?.positions?.[positionIndex]

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-gray-900 text-sm">Position</h5>
        <button type="button" onClick={onRemove} className="text-gray-400 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Role *</label>
          <input
            {...register(p('role'))}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          {posErrors?.role && <p className="mt-1 text-xs text-red-600">{posErrors.role.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Work Arrangement</label>
          <select
            {...register(p('workArrangement'))}
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="">Select...</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">My Location</label>
          <input
            {...register(p('myLocation'))}
            placeholder="e.g., Jakarta, Indonesia"
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Start *</label>
            <input
              {...register(p('startDate'))}
              type="month"
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">End</label>
            <input
              {...register(p('endDate'))}
              type="month"
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      {/* Skills Used */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Skills Used</label>
        <SkillPillField control={control} getValues={getValues} setValue={setValue} path={p('skillsUsed')} placeholder="Add skills used in this role..." />
      </div>
      {/* Achievements */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Achievements</label>
        <AchievementList control={control} register={register} companyIndex={companyIndex} positionIndex={positionIndex} />
      </div>
    </div>
  )
}

// ─── Skill Pill Field (connected to react-hook-form) ────────────────────────

function SkillPillField({
  control,
  getValues,
  setValue,
  path,
  placeholder,
}: {
  control: Control<Profile>
  getValues: ReturnType<typeof useForm<Profile>>['getValues']
  setValue: ReturnType<typeof useForm<Profile>>['setValue']
  path: string
  placeholder?: string
}) {
  const currentValues: string[] = (getValues as any)(path) || []

  // Gather all known skills from the profile for suggestions
  const allSkills = useMemo(() => {
    const profile = (getValues as any)() as Profile
    const skillSet = new Set<string>()
    for (const cat of profile.skillCategories || []) {
      for (const s of cat.skills || []) skillSet.add(s)
    }
    for (const company of profile.companies || []) {
      for (const pos of company.positions || []) {
        for (const s of pos.skillsUsed || []) skillSet.add(s)
      }
    }
    for (const project of profile.projects || []) {
      for (const s of project.skills || []) skillSet.add(s)
    }
    for (const product of profile.products || []) {
      for (const s of product.skills || []) skillSet.add(s)
    }
    return Array.from(skillSet).sort()
  }, [getValues, control])

  return (
    <PillInput
      pills={currentValues}
      suggestions={allSkills}
      placeholder={placeholder}
      onAdd={(val) => {
        const current: string[] = (getValues as any)(path) || []
        ;(setValue as any)(path, [...current, val])
      }}
      onRemove={(idx) => {
        const current: string[] = (getValues as any)(path) || []
        ;(setValue as any)(path, current.filter((_, i) => i !== idx))
      }}
    />
  )
}

// ─── Company Card ────────────────────────────────────────────────────────────

function CompanyCard({
  companyIndex,
  control,
  register,
  getValues,
  setValue,
  errors,
  onRemove,
}: {
  companyIndex: number
  control: Control<Profile>
  register: UseFormRegister<Profile>
  getValues: ReturnType<typeof useForm<Profile>>['getValues']
  setValue: ReturnType<typeof useForm<Profile>>['setValue']
  errors: FieldErrors<Profile>
  onRemove: () => void
}) {
  const c = (field: string) => `companies.${companyIndex}.${field}` as any
  const { fields: positionFields, append: appendPosition, remove: removePosition } = useFieldArray({
    control,
    name: `companies.${companyIndex}.positions` as any,
  })

  return (
    <div className="p-5 bg-gray-50 rounded-xl space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              {...register(c('name'))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input
              {...register(c('industry'))}
              placeholder="e.g., Healthcare, Logistics"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
            <input
              {...register(c('description'))}
              placeholder="What does this company do?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">HQ Location</label>
            <input
              {...register(c('hqLocation'))}
              placeholder="e.g., Singapore"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              {...register(c('website'))}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
        <button type="button" onClick={onRemove} className="ml-4 text-gray-400 hover:text-red-600 mt-1">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Positions */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Positions</h4>
        {positionFields.map((field, posIdx) => (
          <PositionCard
            key={field.id}
            companyIndex={companyIndex}
            positionIndex={posIdx}
            control={control}
            register={register}
            getValues={getValues}
            setValue={setValue}
            errors={errors}
            onRemove={() => removePosition(posIdx)}
          />
        ))}
        <button
          type="button"
          onClick={() =>
            appendPosition({
              role: '',
              startDate: '',
              endDate: null,
              workArrangement: undefined,
              myLocation: '',
              achievements: [],
              skillsUsed: [],
            })
          }
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add position
        </button>
      </div>
    </div>
  )
}

// ─── Tab Definitions ─────────────────────────────────────────────────────────

const TABS = [
  { id: 'personal', label: 'Personal' },
  { id: 'summaries', label: 'Summary' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'products', label: 'Products' },
  { id: 'education', label: 'Education' },
  { id: 'roles', label: 'Role Profiles' },
] as const

type TabId = (typeof TABS)[number]['id']

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ProfileEditor() {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('personal')

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: seedProfile,
  })

  // Load profile from DB on mount, fall back to seed data
  useEffect(() => {
    loadProfile()
      .then((dbProfile) => {
        if (dbProfile) reset(dbProfile)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [reset])

  // Field arrays
  const { fields: summaryFields, append: appendSummary, remove: removeSummary } = useFieldArray({ control, name: 'summaries' })
  const { fields: skillCategoryFields, append: appendSkillCategory, remove: removeSkillCategory } = useFieldArray({ control, name: 'skillCategories' })
  const { fields: companyFields, append: appendCompany, remove: removeCompany } = useFieldArray({ control, name: 'companies' })
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({ control, name: 'projects' })
  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({ control, name: 'products' })
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({ control, name: 'education' })
  const { fields: roleProfileFields, append: appendRoleProfile, remove: removeRoleProfile } = useFieldArray({ control, name: 'roleProfiles' })

  const onSubmit = async (data: Profile) => {
    console.log('onSubmit called')
    setSaving(true)
    try {
      const result = await saveProfile(data)
      console.log('saveProfile returned:', JSON.stringify(result))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error('Failed to save profile:', err?.message || err)
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm'

  return (
    <div className="max-w-5xl mx-auto">
      <form onSubmit={(e) => e.preventDefault()}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        <button
          type="button"
          onClick={() => handleSubmit(onSubmit, (errors) => console.error('Validation errors:', errors))()}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {saved && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Profile saved successfully!
        </div>
      )}

      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
          Loading profile from database...
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-0 overflow-x-auto -mb-px" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
        {/* ─── Personal Information ─── */}
        {activeTab === 'personal' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input {...register('personalInfo.name')} className={inputClass} />
                {errors.personalInfo?.name && <p className="mt-1 text-sm text-red-600">{errors.personalInfo.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input {...register('personalInfo.location')} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input {...register('personalInfo.phone')} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input {...register('personalInfo.email')} type="email" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input {...register('personalInfo.linkedin')} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input {...register('personalInfo.website')} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                {...register('personalInfo.tagline')}
                placeholder="e.g., Engineering Manager | Full Stack Developer"
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* ─── Professional Summaries ─── */}
        {activeTab === 'summaries' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Summaries</h2>
            {summaryFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 text-sm">Summary #{index + 1}</h4>
                  <button type="button" onClick={() => removeSummary(index)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Type *</label>
                  <select {...register(`summaries.${index}.roleType`)} className={inputClass}>
                    <option value="engineering_manager">Engineering Manager</option>
                    <option value="full_stack_engineer">Full Stack Engineer</option>
                    <option value="backend_engineer">Backend Engineer</option>
                    <option value="frontend_engineer">Frontend Engineer</option>
                    <option value="director_of_engineering">Director of Engineering</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="entrepreneur">Entrepreneur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Summary Content *</label>
                  <textarea {...register(`summaries.${index}.content`)} rows={4} className={inputClass} />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSummary({ roleType: '', content: '' })}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Summary
            </button>
          </div>
        )}

        {/* ─── Skills ─── */}
        {activeTab === 'skills' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
            {skillCategoryFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 text-sm">Category #{index + 1}</h4>
                  <button type="button" onClick={() => removeSkillCategory(index)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                    <input
                      {...register(`skillCategories.${index}.name`)}
                      placeholder="e.g., programming_languages"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills *</label>
                    <SkillPillField
                      control={control}
                      getValues={getValues}
                      setValue={setValue}
                      path={`skillCategories.${index}.skills`}
                      placeholder="Type a skill and press Enter..."
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSkillCategory({ name: '', skills: [] })}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Skill Category
            </button>
          </div>
        )}

        {/* ─── Work Experience (Company-oriented) ─── */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
              <button
                type="button"
                onClick={() =>
                  appendCompany({
                    name: '',
                    description: '',
                    industry: '',
                    website: '',
                    hqLocation: '',
                    positions: [{ role: '', startDate: '', endDate: null, workArrangement: undefined, myLocation: '', achievements: [], skillsUsed: [] }],
                  })
                }
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Company
              </button>
            </div>
            {companyFields.map((field, index) => (
              <CompanyCard
                key={field.id}
                companyIndex={index}
                control={control}
                register={register}
                getValues={getValues}
                setValue={setValue}
                errors={errors}
                onRemove={() => removeCompany(index)}
              />
            ))}
          </div>
        )}

        {/* ─── Projects ─── */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Projects</h2>
            {projectFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 text-sm">Project #{index + 1}</h4>
                  <button type="button" onClick={() => removeProject(index)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                    <input {...register(`projects.${index}.name`)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input {...register(`projects.${index}.role`)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      {...register(`projects.${index}.startDate`)}
                      placeholder="e.g., 2021, 2021 August"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      {...register(`projects.${index}.endDate`)}
                      placeholder="e.g., 2022, 2021 December, or leave empty if ongoing"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea {...register(`projects.${index}.description`)} rows={2} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills Used</label>
                  <SkillPillField control={control} getValues={getValues} setValue={setValue} path={`projects.${index}.skills`} placeholder="Add skills..." />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendProject({ name: '', description: '', role: '', startDate: '', endDate: '', skills: [], tags: [] })}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>
        )}

        {/* ─── Products ─── */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Products & Portfolio</h2>
              <p className="text-sm text-gray-500 mt-1">Products you&apos;ve built, sell, or can showcase as portfolio pieces.</p>
            </div>
            {productFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 text-sm">Product #{index + 1}</h4>
                  <button type="button" onClick={() => removeProduct(index)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input {...register(`products.${index}.name`)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <div className="relative">
                      <input {...register(`products.${index}.url`)} placeholder="https://..." className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      {...register(`products.${index}.startDate`)}
                      placeholder="e.g., 2021"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      {...register(`products.${index}.endDate`)}
                      placeholder="Leave empty if ongoing"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea {...register(`products.${index}.description`)} rows={2} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills / Tech Stack</label>
                  <SkillPillField control={control} getValues={getValues} setValue={setValue} path={`products.${index}.skills`} placeholder="Add skills..." />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendProduct({ name: '', description: '', url: '', logo: '', skills: [], tags: [], startDate: '', endDate: '' })}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        )}

        {/* ─── Education ─── */}
        {activeTab === 'education' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
            {educationFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 text-sm">Education #{index + 1}</h4>
                  <button type="button" onClick={() => removeEducation(index)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
                    <input {...register(`education.${index}.degree`)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
                    <input {...register(`education.${index}.institution`)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input {...register(`education.${index}.location`)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Date</label>
                    <input {...register(`education.${index}.graduationDate`)} type="month" className={inputClass} />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendEducation({ degree: '', institution: '', location: '', graduationDate: '' })}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Education
            </button>
          </div>
        )}

        {/* ─── Role Profiles ─── */}
        {activeTab === 'roles' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Role Profiles</h2>
            {roleProfileFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 text-sm">Role Profile #{index + 1}</h4>
                  <button type="button" onClick={() => removeRoleProfile(index)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
                    <input
                      {...register(`roleProfiles.${index}.name`)}
                      placeholder="e.g., engineering_manager"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
                    <input
                      {...register(`roleProfiles.${index}.displayName`)}
                      placeholder="e.g., Engineering Manager"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Summary Key *</label>
                    <input
                      {...register(`roleProfiles.${index}.summaryKey`)}
                      placeholder="References professional summary role type"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Experience Items</label>
                    <input
                      {...register(`roleProfiles.${index}.maxExperienceItems`, { valueAsNumber: true })}
                      type="number"
                      min={1}
                      max={20}
                      className={inputClass}
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
                  maxExperienceItems: 20,
                })
              }
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Role Profile
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
