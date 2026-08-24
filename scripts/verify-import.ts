import 'dotenv/config'

import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../src/payload.config'
import { verifyImportedContent } from '../src/migration/import-snapshot'
import { mapSnapshot } from '../src/migration/map-source'
import { validateSanitySnapshot } from '../src/migration/source-contract'

const source = JSON.parse(
  await readFile(path.resolve('migration/sanity-public-2026-08-25.json'), 'utf8'),
)
const seed = mapSnapshot(validateSanitySnapshot(source))
const payload = await getPayload({ config })
console.log(JSON.stringify(await verifyImportedContent(payload, seed), null, 2))
process.exit(0)
