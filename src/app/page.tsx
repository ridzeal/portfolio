import Link from 'next/link'
import { FileText, Mail, User, ArrowRight } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome to Professional Profile Manager
      </h1>
      
      <p className="text-gray-600 mb-8">
        Manage your professional information in one place and generate tailored CVs and cover letters for different roles.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link
          href="/profile"
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <User className="w-8 h-8 text-blue-600" />
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Profile</h2>
          <p className="text-sm text-gray-600">
            Edit your personal information, skills, experience, and professional summaries.
          </p>
        </Link>

        <Link
          href="/generate/cv"
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-green-600" />
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Generate CV</h2>
          <p className="text-sm text-gray-600">
            Select a role type and generate a tailored CV with relevant experience highlighted.
          </p>
        </Link>

        <Link
          href="/generate/cover-letter"
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <Mail className="w-8 h-8 text-purple-600" />
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Cover Letter</h2>
          <p className="text-sm text-gray-600">
            Generate a personalized cover letter for specific companies and roles.
          </p>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">5</div>
            <div className="text-sm text-gray-600">Role Profiles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">11</div>
            <div className="text-sm text-gray-600">Work Experiences</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">8</div>
            <div className="text-sm text-gray-600">Skill Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">2</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
        </div>
      </div>
    </div>
  )
}
