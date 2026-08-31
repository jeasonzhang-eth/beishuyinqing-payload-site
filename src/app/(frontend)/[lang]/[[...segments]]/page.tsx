import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  About,
  alternateDetailPath,
  Company,
  Contact,
  Home,
  NoteDetail,
  Notes,
  ProjectDetail,
  Projects,
  Services,
} from '@/components/site/site-pages'
import { SiteFrame } from '@/components/site/site-frame'
import { getSiteData, type SiteData } from '@/lib/site/data'
import {
  alternateLanguage,
  canonicalUrl,
  isLanguage,
  localizePath,
  type Language,
} from '@/lib/site/routes'
import type { Note, Project } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type RouteParams = Promise<{ lang: string; segments?: string[] }>

type SeoData = {
  title: string
  description: string
  seo?: {
    title?: string | null
    description?: string | null
    keywords?: { value: string }[] | null
    noIndex?: boolean | null
  }
}

type ResolvedRoute =
  | { kind: 'home' | 'about' | 'company' | 'contact' | 'services' | 'projects' | 'notes' }
  | { kind: 'project'; item: Project }
  | { kind: 'note'; item: Note }

function resolveRoute(
  data: SiteData,
  language: Language,
  segments: string[],
): ResolvedRoute | null {
  if (segments.length === 0) return { kind: 'home' }
  if (segments.length === 1) {
    const route = segments[0]
    if (
      route === 'about' ||
      route === 'company' ||
      route === 'contact' ||
      route === 'services' ||
      route === 'projects' ||
      route === 'notes'
    ) {
      return { kind: route }
    }
    return null
  }
  if (segments.length === 2 && segments[0] === 'projects') {
    const item = data.projects.find(
      (project) => project.language === language && project.slug === segments[1],
    )
    return item ? { kind: 'project', item } : null
  }
  if (segments.length === 2 && segments[0] === 'notes') {
    const item = data.notes.find((note) => note.language === language && note.slug === segments[1])
    return item ? { kind: 'note', item } : null
  }
  return null
}

function seoData(data: SiteData, language: Language, route: ResolvedRoute): SeoData {
  switch (route.kind) {
    case 'home':
      return data.home[language]
    case 'about':
      return data.about[language]
    case 'company':
      return data.company[language]
    case 'contact':
      return data.contact[language]
    case 'services':
      return data.servicesPage[language]
    case 'projects':
      return data.projectsPage[language]
    case 'notes':
      return data.notesPage[language]
    case 'project':
    case 'note':
      return {
        title: route.item.title,
        description: route.item.summary,
        seo: route.item.seo,
      }
  }
}

function alternatePath(
  data: SiteData,
  language: Language,
  segments: string[],
  route: ResolvedRoute,
): string {
  if (route.kind === 'project') {
    return alternateDetailPath(data, language, 'projects', route.item)
  }
  if (route.kind === 'note') return alternateDetailPath(data, language, 'notes', route.item)
  return localizePath(alternateLanguage(language), segments.join('/'))
}

export async function generateMetadata({ params }: { params: RouteParams }): Promise<Metadata> {
  const { lang, segments = [] } = await params
  if (!isLanguage(lang)) return {}
  const data = await getSiteData()
  const route = resolveRoute(data, lang, segments)
  if (!route) return {}
  const source = seoData(data, lang, route)
  const brandName = lang === 'zh' ? data.settings.shortNameZh : data.settings.shortNameEn
  const title = route.kind === 'home' ? brandName : source.seo?.title || source.title
  const description = source.seo?.description || source.description
  const pageTitle = title === brandName ? title : `${title} | ${brandName}`
  const pathname = localizePath(lang, segments.join('/'))
  const alternate = alternatePath(data, lang, segments, route)
  const alternateLang = alternateLanguage(lang)
  return {
    metadataBase: new URL(data.settings.siteUrl),
    title: pageTitle,
    description,
    keywords: source.seo?.keywords?.map((keyword) => keyword.value),
    alternates: {
      canonical: pathname,
      languages: {
        [lang]: pathname,
        [alternateLang]: alternate,
        'x-default': lang === 'en' ? pathname : alternate,
      },
    },
    robots: source.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: pageTitle,
      description,
      siteName: brandName,
      type: route.kind === 'note' ? 'article' : 'website',
      url: canonicalUrl(data.settings.siteUrl, pathname),
      locale: lang === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: '/brand/share-card.png',
          width: 1200,
          height: 630,
          alt: `${brandName} / Multiple Engine`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: ['/brand/share-card.png'],
    },
  }
}

export default async function SitePage({ params }: { params: RouteParams }) {
  const { lang, segments = [] } = await params
  if (!isLanguage(lang)) notFound()
  const data = await getSiteData()
  const route = resolveRoute(data, lang, segments)
  if (!route) notFound()
  const otherPath = alternatePath(data, lang, segments, route)

  let page
  switch (route.kind) {
    case 'home':
      page = <Home data={data} language={lang} />
      break
    case 'about':
      page = <About data={data} language={lang} />
      break
    case 'company':
      page = <Company data={data} language={lang} />
      break
    case 'contact':
      page = <Contact data={data} language={lang} />
      break
    case 'services':
      page = <Services data={data} language={lang} />
      break
    case 'projects':
      page = <Projects data={data} language={lang} />
      break
    case 'project':
      page = <ProjectDetail data={data} language={lang} project={route.item} />
      break
    case 'notes':
      page = <Notes data={data} language={lang} />
      break
    case 'note':
      page = <NoteDetail data={data} language={lang} note={route.item} />
      break
  }

  return (
    <SiteFrame alternatePath={otherPath} data={data} language={lang}>
      {page}
    </SiteFrame>
  )
}
