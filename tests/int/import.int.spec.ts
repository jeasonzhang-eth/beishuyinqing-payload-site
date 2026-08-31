import { readFileSync } from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'
import { describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { importSnapshot, verifyImportedContent } from '@/migration/import-snapshot'
import { mapSnapshot } from '@/migration/map-source'
import { validateSanitySnapshot } from '@/migration/source-contract'

const seed = mapSnapshot(
  validateSanitySnapshot(
    JSON.parse(readFileSync(path.resolve('migration/sanity-public-2026-08-25.json'), 'utf8')),
  ),
)

describe('Payload content import', () => {
  it('is idempotent and preserves all routed records', async () => {
    const payload = await getPayload({ config })
    const first = await importSnapshot(payload, seed)
    const second = await importSnapshot(payload, seed)

    expect(first.created + first.updated).toBe(30)
    expect(second).toEqual({ globals: 9, created: 0, updated: 30 })
    expect(await verifyImportedContent(payload, seed)).toEqual({
      projects: 12,
      services: 10,
      notes: 8,
    })
  }, 30_000)
})
