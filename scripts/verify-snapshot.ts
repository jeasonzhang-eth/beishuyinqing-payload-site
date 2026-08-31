import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { validateSanitySnapshot } from '../src/migration/source-contract'

const snapshotPath = path.resolve('migration/sanity-public-2026-08-25.json')
const checksumPath = snapshotPath.replace(/\.json$/, '.sha256')
const [serialized, checksum] = await Promise.all([
  readFile(snapshotPath, 'utf8'),
  readFile(checksumPath, 'utf8'),
])
const expected = checksum.trim().split(/\s+/)[0]
const actual = createHash('sha256').update(serialized).digest('hex')
if (actual !== expected) throw new Error(`Snapshot checksum mismatch: expected ${expected}, got ${actual}`)
const snapshot = validateSanitySnapshot(JSON.parse(serialized))
console.log(`Verified ${snapshot.siteDocuments.length} site documents and ${snapshot.notes.length} Notes.`)
console.log(`SHA-256 ${actual}`)
