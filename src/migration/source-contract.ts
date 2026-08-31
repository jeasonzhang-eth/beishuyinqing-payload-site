import { isLanguage } from '@/content/contracts'

export type SanityDocument = Record<string, unknown> & {
  _id: string
  _type: string
}

export type SanitySnapshot = {
  exportedAt: string
  projectId: '7lstorz2'
  dataset: 'production'
  apiVersion: '2026-07-13'
  siteDocuments: SanityDocument[]
  notes: SanityDocument[]
}

const PROJECT_KEYS = [
  'capty',
  'twitter-translator',
  'routescope',
  'apple-price',
  'usd-liquidity',
  'wecom-kf-ai-agent',
] as const

const SERVICE_KEYS = [
  'product-development',
  'enterprise-ai',
  'geo-visibility',
  'workflow-automation',
  'cloud-infrastructure',
] as const

const NOTE_KEYS = [
  'ai-agent-workflow',
  'desktop-automation',
  'creator-tools',
  'market-research',
] as const

const FIXED_TYPES = [
  'siteCopy',
  'homePage',
  'aboutPage',
  'companyPage',
  'contactPage',
  'servicesPage',
  'projectsPage',
  'notesPage',
] as const

function record(value: unknown, context: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${context} must be an object`)
  }
  return value as Record<string, unknown>
}

function text(value: unknown, context: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${context} must be text`)
  return value
}

function documents(value: unknown, context: string): SanityDocument[] {
  if (!Array.isArray(value)) throw new Error(`${context} must be an array`)
  return value.map((entry, index) => {
    const source = record(entry, `${context}[${index}]`)
    return {
      ...source,
      _id: text(source._id, `${context}[${index}]._id`),
      _type: text(source._type, `${context}[${index}]._type`),
    }
  })
}

function validateUniqueIds(entries: SanityDocument[]): void {
  const ids = entries.map((entry) => entry._id)
  if (new Set(ids).size !== ids.length) throw new Error('Snapshot contains duplicate Sanity IDs')
}

function validatePairs(entries: SanityDocument[], keys: readonly string[], kind: string): void {
  const identities = new Set<string>()
  for (const entry of entries) {
    const language = entry.language
    const key = entry.translationKey
    if (!isLanguage(language)) throw new Error(`${entry._id} has invalid language`)
    if (typeof key !== 'string') throw new Error(`${entry._id} has invalid translationKey`)
    const identity = `${key}:${language}`
    if (identities.has(identity)) throw new Error(`Duplicate ${kind} translation ${identity}`)
    identities.add(identity)
  }
  for (const key of keys) {
    for (const language of ['zh', 'en']) {
      if (!identities.has(`${key}:${language}`)) {
        throw new Error(`Missing ${kind} translation ${key}:${language}`)
      }
    }
  }
  if (identities.size !== keys.length * 2) {
    throw new Error(`Unexpected ${kind} translation count ${identities.size}`)
  }
}

function validateRoutes(entries: SanityDocument[], kind: string): void {
  const routes = new Set<string>()
  for (const entry of entries) {
    const language = text(entry.language, `${entry._id}.language`)
    const slug = text(entry.slug, `${entry._id}.slug`)
    const route = `${language}/${slug}`
    if (routes.has(route)) throw new Error(`Duplicate ${kind} route ${route}`)
    routes.add(route)
  }
}

export function validateSanitySnapshot(value: unknown): SanitySnapshot {
  const source = record(value, 'Snapshot')
  if (source.projectId !== '7lstorz2') throw new Error('Snapshot has the wrong Sanity project')
  if (source.dataset !== 'production') throw new Error('Snapshot has the wrong Sanity dataset')
  if (source.apiVersion !== '2026-07-13') throw new Error('Snapshot has the wrong API version')
  const exportedAt = text(source.exportedAt, 'Snapshot.exportedAt')
  if (Number.isNaN(Date.parse(exportedAt))) throw new Error('Snapshot.exportedAt is invalid')

  const siteDocuments = documents(source.siteDocuments, 'Snapshot.siteDocuments')
  const notes = documents(source.notes, 'Snapshot.notes')
  if (siteDocuments.length !== 39) {
    throw new Error(`Expected 39 site documents, got ${siteDocuments.length}`)
  }
  if (notes.length !== 8) throw new Error(`Expected 8 Notes, got ${notes.length}`)
  validateUniqueIds([...siteDocuments, ...notes])

  const byId = new Map(siteDocuments.map((entry) => [entry._id, entry]))
  if (byId.get('siteSettings')?._type !== 'siteSettings') {
    throw new Error('Missing siteSettings singleton')
  }
  for (const type of FIXED_TYPES) {
    for (const language of ['zh', 'en']) {
      const id = `${type}-${language}`
      if (byId.get(id)?._type !== type) throw new Error(`Missing fixed document ${id}`)
    }
  }

  const projects = siteDocuments.filter((entry) => entry._type === 'project')
  const services = siteDocuments.filter((entry) => entry._type === 'service')
  validatePairs(projects, PROJECT_KEYS, 'project')
  validatePairs(services, SERVICE_KEYS, 'service')
  validatePairs(notes, NOTE_KEYS, 'Note')
  validateRoutes(projects, 'project')
  validateRoutes(services, 'service')
  validateRoutes(notes, 'Note')

  return {
    exportedAt,
    projectId: '7lstorz2',
    dataset: 'production',
    apiVersion: '2026-07-13',
    siteDocuments,
    notes,
  }
}
