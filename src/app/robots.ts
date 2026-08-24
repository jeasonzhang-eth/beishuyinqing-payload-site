import type { MetadataRoute } from 'next'

import { getSiteData } from '@/lib/site/data'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { settings } = await getSiteData()
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    sitemap: `${settings.siteUrl}/sitemap.xml`,
  }
}
