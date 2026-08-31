import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { validateSanitySnapshot } from '../src/migration/source-contract'

const projectId = '7lstorz2'
const dataset = 'production'
const apiVersion = '2026-07-13'
const output = path.resolve('migration/sanity-public-2026-08-25.json')

const query = `{
  "siteDocuments": *[
    _type in [
      "siteSettings", "siteCopy", "homePage", "aboutPage", "companyPage", "contactPage",
      "servicesPage", "projectsPage", "notesPage", "project", "service"
    ] && !(_id in path("drafts.**"))
  ] | order(_type asc, order asc, language asc) {
    ...,
    "slug": slug.current,
    "defaultShareImage": select(defined(defaultShareImage.asset) => defaultShareImage{
      ...,
      "asset": asset->{_id, url, metadata{dimensions}}
    }, null)
  },
  "notes": *[
    _type == "note" && !(_id in path("drafts.**")) && defined(slug.current)
  ] | order(featured desc, publishedAt desc, title asc) {
    ...,
    "slug": slug.current,
    content[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->{_id, url, metadata{dimensions}}
      }
    }
  }
}`

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !['_rev', '_createdAt', '_updatedAt'].includes(key))
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, stable(child)]),
    )
  }
  return value
}

const endpoint = new URL(
  `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
)
endpoint.searchParams.set('query', query)
endpoint.searchParams.set('perspective', 'published')

const response = await fetch(endpoint, { headers: { Accept: 'application/json' } })
if (!response.ok) throw new Error(`Sanity export failed: ${response.status} ${response.statusText}`)
const body = (await response.json()) as { result?: unknown }
const result = body.result as { siteDocuments?: unknown; notes?: unknown } | undefined
const snapshot = validateSanitySnapshot({
  exportedAt: new Date().toISOString(),
  projectId,
  dataset,
  apiVersion,
  siteDocuments: result?.siteDocuments,
  notes: result?.notes,
})

const serialized = `${JSON.stringify(stable(snapshot), null, 2)}\n`
const digest = createHash('sha256').update(serialized).digest('hex')
await mkdir(path.dirname(output), { recursive: true })
await writeFile(output, serialized)
await writeFile(output.replace(/\.json$/, '.sha256'), `${digest}  ${path.basename(output)}\n`)
console.log(`Exported ${snapshot.siteDocuments.length} site documents and ${snapshot.notes.length} Notes.`)
console.log(`SHA-256 ${digest}`)
