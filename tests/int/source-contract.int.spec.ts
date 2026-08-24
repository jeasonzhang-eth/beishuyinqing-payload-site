import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { validateSanitySnapshot } from '@/migration/source-contract'

const snapshotPath = path.resolve('migration/sanity-public-2026-08-25.json')

describe('immutable Sanity migration snapshot', () => {
  it('contains the complete public bilingual source dataset', () => {
    const snapshot = validateSanitySnapshot(JSON.parse(readFileSync(snapshotPath, 'utf8')))

    expect(snapshot.projectId).toBe('7lstorz2')
    expect(snapshot.dataset).toBe('production')
    expect(snapshot.siteDocuments).toHaveLength(39)
    expect(snapshot.notes).toHaveLength(8)
  })
})
