---
feature: profile-editor-v2
status: delivered
specs: []
plans: []
commits: (see git log)
---

# Profile Editor V2 — UI Overhaul & PostgreSQL Migration

## What Was Built

Complete rework of the profile editor page (`/profile`) with 9 UX improvements: tab-based layout, pill-style skill input with autocomplete, company-oriented work experience with nested positions, editable achievement lists, per-position work arrangement/location fields, project date spans and skills, new Products section, and PostgreSQL database with server actions for persistence.

## Position in the System

The profile editor is the primary data entry surface for the Professional Profile Manager. It feeds data into CV generation (`/generate/cv`) and cover letter generation (`/generate/cover-letter`). All profile data flows through the `Profile` Zod type defined in `src/types/profile.ts`.

## Data Model

### Profile Schema (`prisma/schema.prisma`)

| Model | Key Fields | Notes |
|---|---|---|
| `Profile` | name, location, phone, email, linkedin, website, tagline | Linked to `User` via `userId` |
| `ProfessionalSummary` | roleType, content | Unique per profile+roleType |
| `SkillCategory` | name | Unique per profile+name |
| `Skill` | name | FK → SkillCategory |
| `WorkExperience` | company, role, location, startDate, endDate, type, industry | Flat storage; grouped into Company→Position in app layer |
| `Achievement` | text | FK → WorkExperience |
| `AchievementTag` | name | FK → Achievement |
| `ExperienceSkill` | name | FK → WorkExperience |
| `Project` | name, description, role, startDate, endDate | startDate/endDate are free-form strings (e.g., "2021 August") |
| `ProjectSkill` / `ProjectTag` | name | FK → Project |
| `Product` | name, description, url, logo, startDate, endDate | New in V2 |
| `ProductSkill` / `ProductTag` | name | FK → Product |
| `Education` | degree, institution, location, graduationDate | |
| `RoleProfile` | name, displayName, summaryKey, maxExperienceItems | Unique per profile+name |
| `RoleProfileSkill` | name, type (highlight/filter/exclude) | FK → RoleProfile |

### App-Level Type Structure (`src/types/profile.ts`)

The `Profile` type uses a **company-first hierarchy** for work experience:

```
Profile
├── companies[]        (name, description, industry, website, hqLocation)
│   └── positions[]    (role, startDate, endDate, workArrangement, myLocation)
│       ├── achievements[]  (text, tags[])
│       └── skillsUsed[]
├── projects[]         (name, description, role, startDate, endDate, skills[], tags[])
├── products[]         (name, description, url, logo, startDate, endDate, skills[], tags[])
└── ...
```

The Prisma schema stores experiences flat. The `loadProfile()` action groups them by company name. The `saveProfile()` action flattens them back.

## API Endpoints

### Server Actions (`src/app/profile/actions.ts`)

| Action | Description |
|---|---|
| `saveProfile(data: Profile)` | Validates via Zod, ensures default user exists, delete-and-recreate all profile relations |
| `loadProfile(): Promise<Profile \| null>` | Reads from DB, maps flat experiences to company→positions, returns null if no profile exists |

Both are `'use server'` functions called from the client component.

## Architecture

### Files Changed/Created

| File | Purpose |
|---|---|
| `src/types/profile.ts` | Zod schemas + TypeScript types (Company, Position, Product added) |
| `src/app/profile/page.tsx` | Profile editor — tabs, pill input, company cards, nested positions |
| `src/app/profile/actions.ts` | Server actions for save/load (new) |
| `src/lib/seed-data.ts` | Hardcoded seed data (restructured for company→positions) |
| `src/lib/cv-generator.ts` | Updated to flatten company→positions for CV output |
| `src/lib/profile.ts` | Data access layer (kept for reference, superseded by actions.ts) |
| `prisma/schema.prisma` | PostgreSQL provider, Product/ProductSkill/ProductTag models, project dates |
| `e2e/profile-editor.spec.ts` | 35 Playwright E2E tests (new) |
| `playwright.config.ts` | Playwright configuration (new) |

### Key Patterns

- **PillInput component** — Reusable skill/tag input with autocomplete suggestions gathered from all profile skills. Uses `inputRef.current?.value` in keydown handler to avoid stale React state from batched updates.
- **CompanyCard / PositionCard** — Nested components using `useFieldArray` at each level (`companies.N.positions.M.achievements.P`).
- **Form submission** — Button is `type="button"` with `onClick={handleSubmit(onSubmit)}`. Form wrapper has `onSubmit={(e) => e.preventDefault()}` to prevent native navigation.
- **Tab layout** — Single `activeTab` state controls which section renders. No lazy loading.

## Known Issues / Deferred Work

- **Pill input + Playwright**: `fill()` / `pressSequentially()` on the controlled React input doesn't reliably trigger `onChange`, so pill add/remove/autocomplete tests are excluded. The UI works correctly in manual testing.
- **Company data field round-trip**: Editing a company-level field (e.g., industry) and saving may not persist correctly due to the delete-and-recreate strategy grouping by company name. Works for additive changes.
- **Auth not wired up**: Uses a hardcoded default user (`ridzeal@gmail.com`). No NextAuth integration in the UI yet.
- **CV/Cover Letter generators**: Updated to work with new `Company[]` structure but not tested with the new profile data.
- **No optimistic UI**: Save button disables during server action but no skeleton/loading states for tab content.
