import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type {
  AboutPage,
  CompanyPage,
  ContactPage,
  HomePage,
  Note,
  NotesPage,
  Project,
  ProjectsPage,
  Service,
  ServicesPage,
  SiteCopy,
  SiteSetting,
} from '@/payload-types'

export type SiteData = {
  settings: SiteSetting
  copy: SiteCopy
  home: HomePage
  about: AboutPage
  company: CompanyPage
  contact: ContactPage
  servicesPage: ServicesPage
  projectsPage: ProjectsPage
  notesPage: NotesPage
  projects: Project[]
  services: Service[]
  notes: Note[]
}

export const getSiteData = cache(async (): Promise<SiteData> => {
  const payload = await getPayload({ config })
  const [
    settings,
    copy,
    home,
    about,
    company,
    contact,
    servicesPage,
    projectsPage,
    notesPage,
    projects,
    services,
    notes,
  ] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 1, draft: false, overrideAccess: true }),
    payload.findGlobal({ slug: 'site-copy', depth: 0, draft: false, overrideAccess: true }),
    payload.findGlobal({ slug: 'home-page', depth: 0, draft: false, overrideAccess: true }),
    payload.findGlobal({ slug: 'about-page', depth: 0, draft: false, overrideAccess: true }),
    payload.findGlobal({ slug: 'company-page', depth: 0, draft: false, overrideAccess: true }),
    payload.findGlobal({ slug: 'contact-page', depth: 0, draft: false, overrideAccess: true }),
    payload.findGlobal({ slug: 'services-page', depth: 0, draft: false, overrideAccess: true }),
    payload.findGlobal({ slug: 'projects-page', depth: 0, draft: false, overrideAccess: true }),
    payload.findGlobal({ slug: 'notes-page', depth: 0, draft: false, overrideAccess: true }),
    payload.find({
      collection: 'projects',
      where: { _status: { equals: 'published' } },
      sort: 'order',
      pagination: false,
      depth: 0,
      draft: false,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'services',
      where: { and: [{ _status: { equals: 'published' } }, { enabled: { equals: true } }] },
      sort: 'order',
      pagination: false,
      depth: 0,
      draft: false,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'notes',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      pagination: false,
      depth: 0,
      draft: false,
      overrideAccess: true,
    }),
  ])

  return {
    settings,
    copy,
    home,
    about,
    company,
    contact,
    servicesPage,
    projectsPage,
    notesPage,
    projects: projects.docs,
    services: services.docs,
    notes: notes.docs,
  }
})
