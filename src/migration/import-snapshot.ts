import type { Payload } from 'payload'

import type { PayloadSeed } from './map-source'

type RoutedCollection = 'projects' | 'services' | 'notes'
type ImportDocument = Record<string, unknown> & { sourceId: string }

type ImportClient = {
  updateGlobal(args: {
    slug: string
    data: Record<string, unknown>
    draft: false
    overrideAccess: true
  }): Promise<unknown>
  find(args: {
    collection: RoutedCollection
    where: { sourceId: { equals: string } }
    limit: number
    depth: number
    draft: false
    overrideAccess: true
  }): Promise<{ docs: Array<{ id: number | string }> }>
  create(args: {
    collection: RoutedCollection
    data: ImportDocument
    draft: false
    overrideAccess: true
  }): Promise<unknown>
  update(args: {
    collection: RoutedCollection
    id: number | string
    data: ImportDocument
    draft: false
    overrideAccess: true
  }): Promise<unknown>
}

export type ImportSummary = {
  globals: number
  created: number
  updated: number
}

async function upsertCollection(
  client: ImportClient,
  collection: RoutedCollection,
  documents: ImportDocument[],
  summary: ImportSummary,
): Promise<void> {
  for (const data of documents) {
    const existing = await client.find({
      collection,
      where: { sourceId: { equals: data.sourceId } },
      limit: 1,
      depth: 0,
      draft: false,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      await client.update({
        collection,
        id: existing.docs[0].id,
        data,
        draft: false,
        overrideAccess: true,
      })
      summary.updated += 1
    } else {
      await client.create({ collection, data, draft: false, overrideAccess: true })
      summary.created += 1
    }
  }
}

export async function importSnapshot(payload: Payload, seed: PayloadSeed): Promise<ImportSummary> {
  const client = payload as unknown as ImportClient
  const summary: ImportSummary = { globals: 0, created: 0, updated: 0 }
  for (const global of seed.globals) {
    await client.updateGlobal({
      slug: global.slug,
      data: global.data,
      draft: false,
      overrideAccess: true,
    })
    summary.globals += 1
  }
  await upsertCollection(client, 'projects', seed.projects, summary)
  await upsertCollection(client, 'services', seed.services, summary)
  await upsertCollection(client, 'notes', seed.notes, summary)
  return summary
}

export async function verifyImportedContent(payload: Payload, seed: PayloadSeed) {
  const expected = {
    projects: new Set(seed.projects.map((entry) => entry.sourceId)),
    services: new Set(seed.services.map((entry) => entry.sourceId)),
    notes: new Set(seed.notes.map((entry) => entry.sourceId)),
  }
  const actual: Record<RoutedCollection, Set<string>> = {
    projects: new Set(),
    services: new Set(),
    notes: new Set(),
  }

  for (const collection of Object.keys(actual) as RoutedCollection[]) {
    const result = await payload.find({
      collection,
      depth: 0,
      draft: false,
      limit: 100,
      overrideAccess: true,
      pagination: false,
    })
    for (const document of result.docs) {
      if (typeof document.sourceId === 'string') actual[collection].add(document.sourceId)
    }
    if (actual[collection].size !== expected[collection].size) {
      throw new Error(
        `${collection} count mismatch: expected ${expected[collection].size}, got ${actual[collection].size}`,
      )
    }
    for (const sourceId of expected[collection]) {
      if (!actual[collection].has(sourceId)) throw new Error(`${collection} is missing ${sourceId}`)
    }
  }

  return {
    projects: actual.projects.size,
    services: actual.services.size,
    notes: actual.notes.size,
  }
}
