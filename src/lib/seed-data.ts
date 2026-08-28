import type { Profile } from '@/types/profile'

export const seedProfile: Profile = {
  personalInfo: {
    name: 'Riadhi Aditya Hermawan',
    location: 'Jakarta, Indonesia',
    phone: '+62 813 1474 3412',
    email: 'ridzeal@gmail.com',
    linkedin: 'linkedin.com/in/ridzeal',
    tagline: 'Engineering Manager | Full Stack Developer | Tech Entrepreneur',
  },
  summaries: [
    {
      roleType: 'engineering_manager',
      content:
        'Engineering Manager with 10+ years of experience leading cross-functional teams of x+ engineers across healthcare, logistics, and HR tech. Proven track record of delivering x+ products on time, reducing delivery cycles by x%, and improving team velocity by x%. Expert in agile methodologies, system architecture, and technical leadership.',
    },
    {
      roleType: 'full_stack_engineer',
      content:
        'Full Stack Engineer with 10+ years building scalable web applications serving x+ users. Proficient in Golang, Python, JavaScript, React, and Next.js. Delivered end-to-end solutions reducing operational costs by x% and improving application performance by x%. Strong background in system architecture and database design.',
    },
    {
      roleType: 'backend_engineer',
      content:
        'Backend Engineer with 10+ years building high-performance systems handling x+ requests/day. Expert in Golang, Python, microservices architecture, and database optimization. Improved system uptime from x% to x% and reduced API latency by x% across healthcare and logistics domains.',
    },
    {
      roleType: 'director_of_engineering',
      content:
        'Engineering leader with 10+ years building and scaling teams from x to x+ engineers. Strategic thinker who has delivered x+ products generating x% revenue growth. Experienced in managing x+ teams, xM+ budgets, and aligning technology decisions with business objectives.',
    },
    {
      roleType: 'entrepreneur',
      content:
        'Tech entrepreneur who co-founded and built ERP platform managing x plantations and x+ hectares. Delivered x+ client implementations reducing operational costs by x%. Strong background in requirements gathering, system design, and delivering end-to-end business solutions.',
    },
  ],
  skillCategories: [
    {
      name: 'programming_languages',
      skills: ['Golang', 'Python', 'JavaScript', 'PHP', 'Elixir', 'TypeScript'],
    },
    {
      name: 'frontend',
      skills: ['React', 'Next.js', 'HTML5', 'CSS3', 'Tailwind', 'ExtJS'],
    },
    {
      name: 'backend',
      skills: ['REST APIs', 'gRPC', 'Message Queues', 'Microservices', 'WebRTC'],
    },
    {
      name: 'databases',
      skills: ['PostgreSQL', 'MySQL', 'Redis', 'Kafka', 'SQL DBMS'],
    },
    {
      name: 'devops',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'GCP', 'Git'],
    },
    {
      name: 'methodologies',
      skills: ['Agile', 'Scrum', 'Kanban', 'Technical Leadership', 'Software Architecture', 'Project Management'],
    },
    {
      name: 'domain_expertise',
      skills: ['Healthcare', 'Logistics', 'HR Tech', 'Palm Oil Plantation', 'ERP', 'Employee Engagement'],
    },
    {
      name: 'tools',
      skills: ['Atlassian Suite', 'G-Suite', 'Jira', 'Confluence'],
    },
  ],
  experiences: [
    {
      company: 'EngageRocket',
      role: 'Engineering Manager',
      location: 'Remote, Singapore',
      startDate: '2025-06',
      endDate: '2026-06',
      type: 'full_time',
      industry: 'HR Tech',
      achievements: [
        {
          text: 'Leading Delivery Lead for Survey Engineering Squad, managing x concurrent projects with x% on-time delivery rate',
          tags: ['leadership', 'delivery'],
        },
        {
          text: 'Reduced project delivery cycle by x% by implementing automated CI/CD pipelines and sprint optimization',
          tags: ['technical', 'process_improvement'],
        },
        {
          text: 'Managing project lifecycle for x+ engineering tasks, coordinating across x teams to ensure efficient execution',
          tags: ['management', 'project_management'],
        },
        {
          text: 'Mentoring x engineers, resulting in x% improvement in team velocity and x promotions within 6 months',
          tags: ['management', 'mentorship'],
        },
        {
          text: 'Overseeing cross-functional engineering projects across the platform, reducing dependency bottlenecks by x%',
          tags: ['management', 'cross-functional'],
        },
      ],
      skillsUsed: ['team_leadership', 'agile', 'project_management'],
    },
    {
      company: 'Okadoc',
      role: 'Engineering Manager',
      location: 'Remote, Abu Dhabi, UAE',
      startDate: '2022-09',
      endDate: '2025-07',
      type: 'full_time',
      industry: 'Healthcare',
      achievements: [
        {
          text: 'Led cross-functional team of x+ members across UAE, KSA, and Indonesia, achieving x% sprint completion rate',
          tags: ['management', 'quality'],
        },
        {
          text: 'Managed end-to-end product lifecycle for x products, growing user base by x% and reducing churn by x%',
          tags: ['management', 'cross-functional', 'product'],
        },
        {
          text: 'Designed system architecture serving x+ daily active users, improving API response time by x%',
          tags: ['architecture', 'design', 'technical'],
        },
        {
          text: 'Created product roadmap prioritization framework, reducing feature delivery time by x% and increasing stakeholder satisfaction',
          tags: ['product', 'delivery'],
        },
      ],
      skillsUsed: ['team_leadership', 'product_management', 'system_design'],
    },
    {
      company: 'Okadoc',
      role: 'Senior Software Engineer',
      location: 'Remote, Abu Dhabi, UAE',
      startDate: '2022-02',
      endDate: '2022-09',
      type: 'full_time',
      industry: 'Healthcare',
      achievements: [
        {
          text: 'Improved system stability from x% to x% uptime by redesigning critical microservices and implementing monitoring',
          tags: ['technical', 'backend'],
        },
        {
          text: 'Reduced API latency by x% through database query optimization and Redis caching implementation',
          tags: ['technical', 'backend'],
        },
        {
          text: 'Promoted to lead product squad within x months; delivered x projects generating x% new revenue streams',
          tags: ['leadership', 'delivery'],
        },
      ],
      skillsUsed: ['backend', 'system_stability'],
    },
    {
      company: 'Waresix',
      role: 'Tech Lead – Platform',
      location: 'Remote, Jakarta',
      startDate: '2021-05',
      endDate: '2022-03',
      type: 'full_time',
      industry: 'Logistics',
      achievements: [
        {
          text: 'Led Platform Squad of x engineers, delivering core platform products that supported x+ daily transactions',
          tags: ['leadership', 'technical', 'platform'],
        },
        {
          text: 'Architected microservices infrastructure reducing deployment time by x% and increasing system reliability to x%',
          tags: ['technical', 'architecture'],
        },
        {
          text: 'Mentored x junior engineers, achieving x% retention rate and x internal promotions',
          tags: ['management', 'mentorship'],
        },
        {
          text: 'Collaborated with engineering leadership to improve overall team performance, increasing sprint velocity by x%',
          tags: ['leadership', 'cross-functional'],
        },
      ],
      skillsUsed: ['team_leadership', 'platform_architecture'],
    },
    {
      company: 'Mapan',
      role: 'Tech Lead – Third Party Connection',
      location: 'Hybrid, Jakarta',
      startDate: '2020-06',
      endDate: '2021-05',
      type: 'full_time',
      industry: 'HR Tech',
      achievements: [
        {
          text: 'Led integration team connecting Mapan to x third-party partners, increasing partner network by x%',
          tags: ['management', 'integration'],
        },
        {
          text: 'Designed and implemented API gateway handling x+ requests/day with x% uptime',
          tags: ['technical', 'architecture'],
        },
        {
          text: 'Performed product owner role, prioritizing x+ features and reducing partner onboarding time by x%',
          tags: ['product', 'management'],
        },
      ],
      skillsUsed: ['team_leadership', 'integration', 'product_management'],
    },
    {
      company: 'Mapan',
      role: 'Head of Tech – Marketplace',
      location: 'Hybrid, Jakarta',
      startDate: '2020-01',
      endDate: '2020-05',
      type: 'full_time',
      industry: 'E-commerce',
      achievements: [
        {
          text: 'Led x squads building marketplace infrastructure, enabling x% growth in product catalog',
          tags: ['management', 'cross-functional'],
        },
        {
          text: 'Directed technical strategy that reduced infrastructure costs by x% while supporting x% traffic growth',
          tags: ['leadership', 'technical', 'strategy'],
        },
        {
          text: 'Coordinated cross-functional teams of x+ members, achieving x% on-time delivery for marketplace launch',
          tags: ['management', 'cross-functional'],
        },
      ],
      skillsUsed: ['technical_leadership', 'team_management'],
    },
    {
      company: 'Mapan',
      role: 'Head of Tech – Logistics',
      location: 'Hybrid, Jakarta',
      startDate: '2019-03',
      endDate: '2019-12',
      type: 'full_time',
      industry: 'Logistics',
      achievements: [
        {
          text: 'Delivered ERP system for logistics operations, reducing manual processing time by x% and saving x hours/month',
          tags: ['delivery', 'erp', 'vendor_management'],
        },
        {
          text: 'Managed ERP vendor relationships, negotiating contracts that saved x% in annual software costs',
          tags: ['vendor_management', 'delivery'],
        },
        {
          text: 'Successfully transitioned x-person tech team to Gojek as Go Logistics business unit with zero attrition',
          tags: ['management', 'transition'],
        },
      ],
      skillsUsed: ['erp', 'logistics', 'team_management'],
    },
    {
      company: 'Mapan',
      role: 'Software Delivery Manager',
      location: 'Hybrid, Jakarta',
      startDate: '2017-08',
      endDate: '2019-03',
      type: 'full_time',
      industry: 'Social Enterprise',
      achievements: [
        {
          text: 'Led Agile transformation across x tech teams, improving sprint completion rate from x% to x%',
          tags: ['management', 'agile', 'coach'],
        },
        {
          text: 'Delivered x+ planned milestones on time by implementing dependency tracking and risk management',
          tags: ['agile', 'delivery', 'cross-functional'],
        },
        {
          text: 'Built Agile coaching team of x Scrum Masters and x Build Masters, reducing project delays by x%',
          tags: ['management', 'team_growth'],
        },
      ],
      skillsUsed: ['agile', 'scrum', 'team_management'],
    },
    {
      company: 'Mapan',
      role: 'Senior Software Engineer',
      location: 'Hybrid, Jakarta',
      startDate: '2015-05',
      endDate: '2017-07',
      type: 'full_time',
      industry: 'Social Enterprise',
      achievements: [
        {
          text: 'Built x+ in-house applications using Python, Golang, and Elixir, serving x+ users',
          tags: ['technical', 'development'],
        },
        {
          text: 'Improved application performance by x% through code optimization and database query improvements',
          tags: ['technical', 'development'],
        },
        {
          text: 'Appointed Team Coordinator in second year, managing x engineers and reducing bug resolution time by x%',
          tags: ['leadership', 'management'],
        },
      ],
      skillsUsed: ['python', 'golang', 'elixir', 'development'],
    },
    {
      company: 'OWL',
      role: 'Developer / Co-Founder',
      location: 'Onsite, Jakarta',
      startDate: '2012-02',
      endDate: '2015-03',
      type: 'freelance',
      industry: 'Palm Oil Plantation',
      achievements: [
        {
          text: 'Co-founded ERP startup for Palm Oil industry, building platform managing x plantations and x+ hectares',
          tags: ['entrepreneurial', 'erp', 'architecture'],
        },
        {
          text: 'Designed full-stack architecture covering accounting, HR, plant operations, mill, and sales modules',
          tags: ['technical', 'analysis', 'architecture'],
        },
        {
          text: 'Delivered x+ client implementations, reducing plantation operational costs by x% through automation',
          tags: ['delivery', 'client_management'],
        },
      ],
      skillsUsed: ['erp', 'system_analysis', 'full_stack'],
    },
    {
      company: 'Independent',
      role: 'Freelance Developer',
      location: 'Jakarta',
      startDate: '2008-01',
      endDate: '2016-12',
      type: 'freelance',
      industry: 'Various',
      achievements: [
        {
          text: 'Built MVP learning platform for Socio Pte Ltd using WebRTC, supporting x concurrent users',
          tags: ['technical', 'webrtc', 'mvp'],
        },
        {
          text: 'Improved PT Bundamedik outpatient registration system, reducing patient wait time by x%',
          tags: ['technical', 'healthcare', 'integration'],
        },
        {
          text: 'Delivered x+ client projects across healthcare, ERP, and web applications',
          tags: ['technical', 'delivery'],
        },
      ],
      skillsUsed: ['webrtc', 'full_stack', 'healthcare'],
    },
  ],
  projects: [
    {
      name: 'ERP for Palm Oil Plantation',
      description: 'Co-founded and built complete ERP platform managing x plantations, x+ hectares, and x+ employees. Modules include accounting, HR, plant operations, mill management, and sales. Reduced operational costs by x% through automation.',
      role: 'Co-Founder & Lead Developer',
      skills: ['ERP', 'System Design', 'Full Stack Development', 'Python', 'JavaScript'],
      tags: ['entrepreneurial', 'domain_expertise', 'leadership'],
    },
    {
      name: 'Healthcare Patient Platform',
      description: 'Led development of patient engagement platform serving x+ healthcare facilities across UAE and KSA. Improved patient satisfaction by x% and reduced appointment no-shows by x% through automated reminders and engagement tools.',
      role: 'Engineering Manager',
      skills: ['Healthcare', 'Patient Engagement', 'System Architecture'],
      tags: ['healthcare', 'management', 'architecture'],
    },
  ],
  education: [
    {
      degree: 'Bachelor of Engineering',
      institution: 'Bandung Institute of Technology (ITB)',
      location: 'Bandung, Indonesia',
      graduationDate: '2009-08',
    },
  ],
  roleProfiles: [
    {
      name: 'engineering_manager',
      displayName: 'Engineering Manager',
      summaryKey: 'engineering_manager',
      highlightSkills: ['team_leadership', 'agile', 'project_management', 'product_management'],
      experienceFilter: ['management', 'leadership', 'cross-functional'],
      excludeSkills: [],
      maxExperienceItems: 100,
    },
    {
      name: 'full_stack_engineer',
      displayName: 'Full Stack Engineer',
      summaryKey: 'full_stack_engineer',
      highlightSkills: ['programming_languages', 'frontend', 'backend'],
      experienceFilter: ['technical', 'development', 'architecture'],
      excludeSkills: ['management'],
      maxExperienceItems: 100,
    },
    {
      name: 'backend_engineer',
      displayName: 'Backend Engineer',
      summaryKey: 'backend_engineer',
      highlightSkills: ['backend', 'databases', 'devops'],
      experienceFilter: ['technical', 'backend', 'architecture'],
      excludeSkills: ['management', 'frontend'],
      maxExperienceItems: 100,
    },
    {
      name: 'director_of_engineering',
      displayName: 'Director of Engineering',
      summaryKey: 'director_of_engineering',
      highlightSkills: ['technical_leadership', 'team_management', 'strategy'],
      experienceFilter: ['management', 'leadership', 'strategy'],
      excludeSkills: [],
      maxExperienceItems: 100,
    },
    {
      name: 'entrepreneur',
      displayName: 'Tech Entrepreneur',
      summaryKey: 'entrepreneur',
      highlightSkills: ['domain_expertise', 'erp', 'entrepreneurial'],
      experienceFilter: ['entrepreneurial', 'domain_expertise', 'delivery'],
      excludeSkills: [],
      maxExperienceItems: 100,
    },
  ],
}
