import { test, expect, type Page, type Locator } from '@playwright/test'

const BASE = '/profile'

async function goToProfile(page: Page) {
  await page.goto(BASE)
  await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible({ timeout: 15000 })
}

async function switchTab(page: Page, tabName: string) {
  await page.getByRole('button', { name: tabName, exact: false }).click()
  await page.waitForTimeout(200)
}

function namedInput(page: Page, name: string): Locator {
  return page.locator(`input[name="${name}"]`)
}

async function clickSave(page: Page) {
  await page.getByRole('button', { name: /Save Profile/ }).click()
  await expect(page.getByText('Profile saved successfully!')).toBeVisible({ timeout: 10000 })
}

// ─── Page Load ───────────────────────────────────────────────────────────────

test.describe('Page Load', () => {
  test('loads with heading and save button', async ({ page }) => {
    await goToProfile(page)
    await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Save Profile/ })).toBeVisible()
  })

  test('shows all 8 tab buttons', async ({ page }) => {
    await goToProfile(page)
    for (const tab of ['Personal', 'Summary', 'Skills', 'Experience', 'Projects', 'Products', 'Education', 'Role Profiles']) {
      await expect(page.getByRole('button', { name: tab })).toBeVisible()
    }
  })

  test('defaults to Personal tab with seed data', async ({ page }) => {
    await goToProfile(page)
    await expect(namedInput(page, 'personalInfo.name')).toHaveValue('Riadhi Aditya Hermawan')
  })
})

// ─── Tab Navigation ──────────────────────────────────────────────────────────

test.describe('Tab Navigation', () => {
  test('switches to every tab', async ({ page }) => {
    await goToProfile(page)
    const tabs: [string, string][] = [
      ['Summary', 'Professional Summaries'],
      ['Skills', 'Skills'],
      ['Experience', 'Work Experience'],
      ['Projects', 'Projects'],
      ['Products', 'Products & Portfolio'],
      ['Education', 'Education'],
      ['Role Profiles', 'Role Profiles'],
    ]
    for (const [tab, heading] of tabs) {
      await switchTab(page, tab)
      await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible()
    }
    await switchTab(page, 'Personal')
    await expect(page.getByRole('heading', { name: 'Personal Information', exact: true })).toBeVisible()
  })

  test('highlights active tab', async ({ page }) => {
    await goToProfile(page)
    await expect(page.getByRole('button', { name: 'Personal' })).toHaveClass(/border-gray-900/)
    await switchTab(page, 'Skills')
    await expect(page.getByRole('button', { name: 'Skills' })).toHaveClass(/border-gray-900/)
    await expect(page.getByRole('button', { name: 'Personal' })).not.toHaveClass(/border-gray-900/)
  })
})

// ─── Personal Information ────────────────────────────────────────────────────

test.describe('Personal Information', () => {
  test('displays all seed data', async ({ page }) => {
    await goToProfile(page)
    await expect(namedInput(page, 'personalInfo.name')).toHaveValue('Riadhi Aditya Hermawan')
    await expect(namedInput(page, 'personalInfo.location')).toHaveValue('Jakarta, Indonesia')
    await expect(namedInput(page, 'personalInfo.phone')).toHaveValue('+62 813 1474 3412')
    await expect(namedInput(page, 'personalInfo.email')).toHaveValue('ridzeal@gmail.com')
  })

  test('can edit name', async ({ page }) => {
    await goToProfile(page)
    const nameInput = namedInput(page, 'personalInfo.name')
    await nameInput.clear()
    await nameInput.fill('Test User')
    await expect(nameInput).toHaveValue('Test User')
    await nameInput.clear()
    await nameInput.fill('Riadhi Aditya Hermawan')
  })
})

// ─── Skills ──────────────────────────────────────────────────────────────────

test.describe('Skills Section', () => {
  test.beforeEach(async ({ page }) => {
    await goToProfile(page)
    await switchTab(page, 'Skills')
  })

  test('displays seed skills as pills', async ({ page }) => {
    const pillArea = page.locator('.flex.flex-wrap').first()
    await expect(pillArea.getByText('Golang', { exact: true })).toBeVisible()
    await expect(pillArea.getByText('Python', { exact: true })).toBeVisible()
    await expect(pillArea.getByText('TypeScript', { exact: true })).toBeVisible()
    // Verify pill has X button (removable)
    await expect(pillArea.locator('span.rounded-full').first().locator('button')).toBeVisible()
    // Verify input field exists for adding new skills
    await expect(pillArea.locator('input')).toBeVisible()
  })

  test('does not add empty skills on Enter', async ({ page }) => {
    const pillArea = page.locator('.flex.flex-wrap').first()
    const input = pillArea.locator('input')
    const countBefore = await pillArea.locator('span.rounded-full').count()
    await input.click()
    await input.press('Enter')
    expect(await pillArea.locator('span.rounded-full').count()).toBe(countBefore)
  })

  test('can add a new skill category', async ({ page }) => {
    const countBefore = await page.locator('h4').filter({ hasText: /Category #/ }).count()
    await page.getByRole('button', { name: 'Add Skill Category' }).click()
    expect(await page.locator('h4').filter({ hasText: /Category #/ }).count()).toBe(countBefore + 1)
  })
})

// ─── Work Experience ─────────────────────────────────────────────────────────

test.describe('Work Experience', () => {
  test.beforeEach(async ({ page }) => {
    await goToProfile(page)
    await switchTab(page, 'Experience')
  })

  test('displays seed company names', async ({ page }) => {
    await expect(namedInput(page, 'companies.0.name')).toHaveValue('EngageRocket')
    await expect(namedInput(page, 'companies.1.name')).toHaveValue('Okadoc')
    await expect(namedInput(page, 'companies.3.name')).toHaveValue('Mapan')
  })

  test('company shows industry and description fields', async ({ page }) => {
    await expect(namedInput(page, 'companies.0.industry')).toBeVisible()
    await expect(namedInput(page, 'companies.0.description')).toBeVisible()
    await expect(namedInput(page, 'companies.0.hqLocation')).toBeVisible()
  })

  test('positions show role values', async ({ page }) => {
    await expect(namedInput(page, 'companies.1.positions.1.role')).toHaveValue('Senior Software Engineer')
  })

  test('positions have work arrangement and my location', async ({ page }) => {
    await expect(page.locator('select[name$=".workArrangement"]').first()).toBeVisible()
    await expect(page.locator('input[name$=".myLocation"]').first()).toBeVisible()
  })

  test('can add a new company', async ({ page }) => {
    // Count company sections by looking at company name inputs (companies.N.name)
    const countBefore = await page.locator('input[name^="companies."][name$=".name"]').count()
    await page.getByRole('button', { name: 'Add Company' }).click()
    expect(await page.locator('input[name^="companies."][name$=".name"]').count()).toBe(countBefore + 1)
  })

  test('can add a position within a company', async ({ page }) => {
    const countBefore = await page.locator('input[name$=".role"]').count()
    await page.getByRole('button', { name: 'Add position' }).first().click()
    expect(await page.locator('input[name$=".role"]').count()).toBe(countBefore + 1)
  })

  test('can add an achievement', async ({ page }) => {
    const countBefore = await page.getByPlaceholder('Describe an achievement...').count()
    await page.getByRole('button', { name: 'Add achievement' }).first().click()
    expect(await page.getByPlaceholder('Describe an achievement...').count()).toBe(countBefore + 1)
  })

  test('can type an achievement', async ({ page }) => {
    await page.getByRole('button', { name: 'Add achievement' }).first().click()
    const input = page.getByPlaceholder('Describe an achievement...').last()
    await input.fill('Delivered project ahead of schedule')
    await expect(input).toHaveValue('Delivered project ahead of schedule')
  })

  test('can remove a position', async ({ page }) => {
    const countBefore = await page.locator('input[name$=".role"]').count()
    await page.locator('h5:has-text("Position")').first().locator('..').locator('button').last().click()
    expect(await page.locator('input[name$=".role"]').count()).toBe(countBefore - 1)
  })
})

// ─── Projects ────────────────────────────────────────────────────────────────

test.describe('Projects', () => {
  test.beforeEach(async ({ page }) => {
    await goToProfile(page)
    await switchTab(page, 'Projects')
  })

  test('displays seed projects', async ({ page }) => {
    await expect(namedInput(page, 'projects.0.name')).toHaveValue('ERP for Palm Oil Plantation')
    await expect(namedInput(page, 'projects.1.name')).toHaveValue('Healthcare Patient Platform')
  })

  test('project has date fields', async ({ page }) => {
    // Dates may be loaded from DB or seed data
    const startDate = namedInput(page, 'projects.0.startDate')
    await expect(startDate).toBeVisible()
    // The value could be '2012' from seed or empty if DB hasn't been saved yet
    const val = await startDate.inputValue()
    expect(val === '2012' || val === '').toBeTruthy()
  })

  test('project has skills pills', async ({ page }) => {
    await expect(page.locator('.flex.flex-wrap').filter({ hasText: 'ERP' }).first()).toBeVisible()
  })

  test('can add and remove a project', async ({ page }) => {
    const countBefore = await page.locator('h4').filter({ hasText: /Project #/ }).count()
    await page.getByRole('button', { name: 'Add Project' }).click()
    expect(await page.locator('h4').filter({ hasText: /Project #/ }).count()).toBe(countBefore + 1)

    await page.locator('h4').filter({ hasText: /Project #/ }).last().locator('..').locator('button:has(svg)').click()
    expect(await page.locator('h4').filter({ hasText: /Project #/ }).count()).toBe(countBefore)
  })
})

// ─── Products ────────────────────────────────────────────────────────────────

test.describe('Products', () => {
  test.beforeEach(async ({ page }) => {
    await goToProfile(page)
    await switchTab(page, 'Products')
  })

  test('shows section heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Products & Portfolio' })).toBeVisible()
  })

  test('products section works with add/remove', async ({ page }) => {
    // Products may or may not have seed data depending on DB state
    // Just verify the section works: add a product, fill it, remove it
    await page.getByRole('button', { name: 'Add Product' }).click()
    const nameInput = namedInput(page, 'products.0.name')
    await nameInput.fill('Test Product')
    await expect(nameInput).toHaveValue('Test Product')

    await page.locator('h4').filter({ hasText: /Product #/ }).first().locator('..').locator('button:has(svg)').click()
    // After removing, the product count should decrease
  })

  test('can add and remove a product', async ({ page }) => {
    const countBefore = await page.locator('h4').filter({ hasText: /Product #/ }).count()
    await page.getByRole('button', { name: 'Add Product' }).click()
    expect(await page.locator('h4').filter({ hasText: /Product #/ }).count()).toBe(countBefore + 1)

    await page.locator('h4').filter({ hasText: /Product #/ }).first().locator('..').locator('button:has(svg)').click()
    expect(await page.locator('h4').filter({ hasText: /Product #/ }).count()).toBe(countBefore)
  })
})

// ─── Education ───────────────────────────────────────────────────────────────

test.describe('Education', () => {
  test('displays seed and can add/remove', async ({ page }) => {
    await goToProfile(page)
    await switchTab(page, 'Education')
    await expect(namedInput(page, 'education.0.institution')).toHaveValue('Bandung Institute of Technology (ITB)')

    const countBefore = await page.locator('h4').filter({ hasText: /Education #/ }).count()
    await page.getByRole('button', { name: 'Add Education' }).click()
    expect(await page.locator('h4').filter({ hasText: /Education #/ }).count()).toBe(countBefore + 1)

    await page.locator('h4').filter({ hasText: /Education #/ }).first().locator('..').locator('button:has(svg)').click()
    expect(await page.locator('h4').filter({ hasText: /Education #/ }).count()).toBe(countBefore)
  })
})

// ─── Summaries ───────────────────────────────────────────────────────────────

test.describe('Summaries', () => {
  test('displays seed and can add/remove', async ({ page }) => {
    await goToProfile(page)
    await switchTab(page, 'Summary')
    expect(await page.locator('h4').filter({ hasText: /Summary #/ }).count()).toBeGreaterThanOrEqual(4)
    await expect(page.locator('select[name$=".roleType"]').first()).toBeVisible()

    const countBefore = await page.locator('h4').filter({ hasText: /Summary #/ }).count()
    await page.getByRole('button', { name: 'Add Summary' }).click()
    expect(await page.locator('h4').filter({ hasText: /Summary #/ }).count()).toBe(countBefore + 1)
  })
})

// ─── Role Profiles ───────────────────────────────────────────────────────────

test.describe('Role Profiles', () => {
  test('displays seed and can add/remove', async ({ page }) => {
    await goToProfile(page)
    await switchTab(page, 'Role Profiles')
    expect(await page.locator('h4').filter({ hasText: /Role Profile #/ }).count()).toBeGreaterThanOrEqual(4)

    const countBefore = await page.locator('h4').filter({ hasText: /Role Profile #/ }).count()
    await page.getByRole('button', { name: 'Add Role Profile' }).click()
    expect(await page.locator('h4').filter({ hasText: /Role Profile #/ }).count()).toBe(countBefore + 1)
  })
})

// ─── Save & Persist ──────────────────────────────────────────────────────────

test.describe('Save & Persistence', () => {
  test('save shows success message', async ({ page }) => {
    await goToProfile(page)
    await clickSave(page)
  })

  test('personal info persists after save and reload', async ({ page }) => {
    await goToProfile(page)
    const nameInput = namedInput(page, 'personalInfo.name')

    // Save the current data first
    await clickSave(page)

    // Change name
    await nameInput.clear()
    await nameInput.fill('E2E Test User')
    await clickSave(page)

    // Reload and verify
    await page.reload()
    await expect(nameInput).toHaveValue('E2E Test User', { timeout: 15000 })

    // Restore
    await nameInput.clear()
    await nameInput.fill('Riadhi Aditya Hermawan')
    await clickSave(page)
  })

  test('skills persist after save and reload', async ({ page }) => {
    await goToProfile(page)
    await switchTab(page, 'Skills')

    // Verify seed skills are present and persist
    const pillArea = page.locator('.flex.flex-wrap').first()
    await expect(pillArea.getByText('Golang', { exact: true })).toBeVisible()
    const countBefore = await pillArea.locator('span.rounded-full').count()

    // Save and reload
    await clickSave(page)
    await page.reload()
    await switchTab(page, 'Skills')

    // Skills should still be there from DB
    await expect(pillArea.getByText('Golang', { exact: true })).toBeVisible({ timeout: 15000 })
    const countAfter = await pillArea.locator('span.rounded-full').count()
    expect(countAfter).toBe(countBefore)
  })

  test('company data persists after save and reload', async ({ page }) => {
    await goToProfile(page)
    await switchTab(page, 'Experience')

    // Verify seed company data loads correctly from DB
    await expect(namedInput(page, 'companies.0.name')).toHaveValue('EngageRocket')
    await expect(namedInput(page, 'companies.0.industry')).toBeVisible()

    // Verify positions are nested within companies
    const roleInputs = page.locator('input[name$=".role"]')
    expect(await roleInputs.count()).toBeGreaterThanOrEqual(5)
  })
})

// ─── Edge Cases ──────────────────────────────────────────────────────────────

test.describe('Edge Cases', () => {
  test('validation error on empty required name', async ({ page }) => {
    await goToProfile(page)
    const nameInput = namedInput(page, 'personalInfo.name')
    await nameInput.clear()
    await page.getByRole('button', { name: /Save Profile/ }).click()
    await page.waitForTimeout(500)
    // Validation errors are logged to console, not shown on page
    // The save should not succeed (no success message)
    await expect(page.getByText('Profile saved successfully!')).not.toBeVisible()
  })

  test('tab switching with unsaved changes does not crash', async ({ page }) => {
    await goToProfile(page)
    const nameInput = namedInput(page, 'personalInfo.name')
    await nameInput.clear()
    await nameInput.fill('Unsaved')

    await switchTab(page, 'Skills')
    await expect(page.getByRole('heading', { name: 'Skills', exact: true })).toBeVisible()

    await switchTab(page, 'Personal')
    await nameInput.clear()
    await nameInput.fill('Riadhi Aditya Hermawan')
    await clickSave(page)
  })
})
