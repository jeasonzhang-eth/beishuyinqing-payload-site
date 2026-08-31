import { portableTextToLexical, type LexicalState } from './portable-text-to-lexical'
import type { SanityDocument, SanitySnapshot } from './source-contract'

type SeedRecord = Record<string, unknown> & { sourceId: string }

export type NoteSeed = SeedRecord & { content: LexicalState }

export type PayloadSeed = {
  globals: Array<{ slug: string; data: Record<string, unknown> }>
  projects: SeedRecord[]
  services: SeedRecord[]
  notes: NoteSeed[]
}

const metadata = new Set(['_id', '_type', '_key', 'language'])

function rows(values: unknown[]): Array<{ value: string }> {
  if (!values.every((value) => typeof value === 'string')) {
    throw new Error('Expected a string array while mapping Payload rows')
  }
  return values.map((value) => ({ value: value as string }))
}

function mapValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    if (value.every((entry) => typeof entry === 'string')) return rows(value)
    return value.map(mapValue)
  }
  if (value && typeof value === 'object') return mapObject(value as Record<string, unknown>)
  return value
}

function mapObject(source: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(source)
      .filter(([key, value]) => !metadata.has(key) && value !== null && value !== undefined)
      .map(([key, value]) => [key, mapValue(value)]),
  )
}

function findFixed(snapshot: SanitySnapshot, type: string, language?: string): SanityDocument {
  const id = language ? `${type}-${language}` : type
  const document = snapshot.siteDocuments.find((entry) => entry._id === id)
  if (!document) throw new Error(`Missing migration source ${id}`)
  return document
}

function localizedGlobal(snapshot: SanitySnapshot, type: string, slug: string) {
  return {
    slug,
    data: {
      zh: mapObject(findFixed(snapshot, type, 'zh')),
      en: mapObject(findFixed(snapshot, type, 'en')),
      _status: 'published',
    },
  }
}

function routed(document: SanityDocument): SeedRecord {
  return {
    ...mapObject(document),
    language: document.language,
    sourceId: document._id,
    _status: 'published',
  }
}

function note(document: SanityDocument): NoteSeed {
  const mapped = routed(document)
  delete mapped.content
  const sourceFaq = Array.isArray(document.faq) ? document.faq : []
  mapped.faq = sourceFaq.map((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`${document._id}.faq[${index}] must be an object`)
    }
    const faq = entry as Record<string, unknown>
    if (typeof faq.question !== 'string') {
      throw new Error(`${document._id}.faq[${index}].question must be text`)
    }
    return {
      question: faq.question,
      answer: portableTextToLexical(faq.answer),
    }
  })
  const sourceUpdatedAt = mapped.updatedAt
  delete mapped.updatedAt
  return {
    ...mapped,
    sourceUpdatedAt,
    content: portableTextToLexical(document.content),
  }
}

export function mapSnapshot(snapshot: SanitySnapshot): PayloadSeed {
  const siteSettings = mapObject(findFixed(snapshot, 'siteSettings'))
  delete siteSettings.defaultShareImage
  return {
    globals: [
      { slug: 'site-settings', data: { ...siteSettings, _status: 'published' } },
      localizedGlobal(snapshot, 'siteCopy', 'site-copy'),
      localizedGlobal(snapshot, 'homePage', 'home-page'),
      localizedGlobal(snapshot, 'aboutPage', 'about-page'),
      localizedGlobal(snapshot, 'companyPage', 'company-page'),
      localizedGlobal(snapshot, 'contactPage', 'contact-page'),
      localizedGlobal(snapshot, 'servicesPage', 'services-page'),
      localizedGlobal(snapshot, 'projectsPage', 'projects-page'),
      localizedGlobal(snapshot, 'notesPage', 'notes-page'),
    ],
    projects: snapshot.siteDocuments.filter((entry) => entry._type === 'project').map(routed),
    services: snapshot.siteDocuments.filter((entry) => entry._type === 'service').map(routed),
    notes: snapshot.notes.map(note),
  }
}
