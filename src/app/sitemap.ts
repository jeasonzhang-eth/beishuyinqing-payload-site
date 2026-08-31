import type { MetadataRoute } from 'next'

import { getSiteData } from '@/lib/site/data'
import { canonicalUrl, LANGUAGES, localizePath } from '@/lib/site/routes'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSiteData()
  const staticRoutes = ['', 'about', 'company', 'contact', 'services', 'projects', 'notes']
  const paths = [
    ...LANGUAGES.flatMap((language) => staticRoutes.map((route) => localizePath(language, route))),
    ...data.projects.map((project) => localizePath(project.language, `projects/${project.slug}`)),
    ...data.notes.map((note) => localizePath(note.language, `notes/${note.slug}`)),
  ]
  return paths.map((pathname) => ({ url: canonicalUrl(data.settings.siteUrl, pathname) }))
}
