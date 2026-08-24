import { expect, test } from '@playwright/test'

test.describe('Payload-backed website', () => {
  test('renders the bilingual homepage and responsive artwork', async ({ page }, testInfo) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/zh\/$/)
    await expect(page).toHaveTitle(/Jeason Zhang/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
    await expect(page.locator('h1')).toContainText('真实业务问题')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://beishuyinqing.cn/zh/',
    )
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
      'href',
      'https://beishuyinqing.cn/en/',
    )

    const artwork = page.locator('.editorial-art__image').first()
    await expect(artwork).toBeVisible()
    expect(await artwork.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(
      0,
    )
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    await page.screenshot({ path: testInfo.outputPath('homepage-desktop.png'), fullPage: true })

    await page.setViewportSize({ width: 390, height: 844 })
    await page.reload()
    await expect(page.locator('.site-toolbar')).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    await page.screenshot({ path: testInfo.outputPath('homepage-mobile.png'), fullPage: true })
  })

  test('renders migrated project and note detail content', async ({ page }) => {
    await page.goto('/zh/projects/capty/')
    await expect(page.locator('h1')).toHaveText('Capty')
    await expect(page.locator('.faq-list details')).toHaveCount(2)
    await expect(page.locator('.control-link')).toHaveAttribute('href', '/en/projects/capty/')

    await page.goto('/en/notes/ai-agent-workflow/')
    await expect(page.locator('h1')).toHaveText('AI agent workflow')
    await expect(page.locator('.portable-note-body h2').first()).toBeVisible()
    await expect(page.locator('.control-link')).toHaveAttribute(
      'href',
      '/zh/notes/ai-agent-workflow/',
    )
  })

  test('publishes crawler and AI discovery files', async ({ request }) => {
    const [robots, sitemap, llms] = await Promise.all([
      request.get('/robots.txt'),
      request.get('/sitemap.xml'),
      request.get('/llms.txt'),
    ])
    expect(robots.ok()).toBe(true)
    expect(await robots.text()).toContain('Sitemap: https://beishuyinqing.cn/sitemap.xml')
    expect(sitemap.ok()).toBe(true)
    expect((await sitemap.text()).match(/<loc>/g)).toHaveLength(34)
    expect(llms.ok()).toBe(true)
    expect(await llms.text()).toContain('Multiple Engine')
  })
})
