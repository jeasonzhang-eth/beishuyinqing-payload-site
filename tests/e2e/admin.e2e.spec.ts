import { expect, test } from '@playwright/test'

import { login } from '../helpers/login'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

test.describe('Payload admin', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('authenticates and exposes website content models', async ({ page }) => {
    await login({ page, user: testUser })
    await expect(page).toHaveTitle(/Multiple Engine CMS/)
    await expect(page.getByText('Projects', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Services', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Notes', { exact: true }).first()).toBeVisible()
  })
})
