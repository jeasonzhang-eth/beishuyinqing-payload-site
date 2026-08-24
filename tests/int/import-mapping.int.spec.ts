import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { mapSnapshot } from '@/migration/map-source'
import { validateSanitySnapshot } from '@/migration/source-contract'

const snapshot = validateSanitySnapshot(
  JSON.parse(readFileSync(path.resolve('migration/sanity-public-2026-08-25.json'), 'utf8')),
)

describe('Payload migration mapping', () => {
  it('maps every fixed document and routed record', () => {
    const seed = mapSnapshot(snapshot)

    expect(seed.globals).toHaveLength(9)
    expect(seed.projects).toHaveLength(12)
    expect(seed.services).toHaveLength(10)
    expect(seed.notes).toHaveLength(8)
    expect(seed.globals.map((entry) => entry.slug)).toEqual([
      'site-settings',
      'site-copy',
      'home-page',
      'about-page',
      'company-page',
      'contact-page',
      'services-page',
      'projects-page',
      'notes-page',
    ])
  })

  it('preserves source identity and converts Payload array rows', () => {
    const seed = mapSnapshot(snapshot)
    const project = seed.projects.find((entry) => entry.sourceId === 'project-capty-zh')
    const note = seed.notes.find((entry) => entry.sourceId === 'note-ai-agent-workflow-en')

    expect(project).toEqual(
      expect.objectContaining({ language: 'zh', translationKey: 'capty', slug: 'capty' }),
    )
    expect(project?.outcomes).toEqual(expect.arrayContaining([expect.objectContaining({ value: expect.any(String) })]))
    expect(note?.content.root.children.length).toBeGreaterThan(1)
    expect((note?.faq as Array<{ answer: { root: { children: unknown[] } } }>)[0].answer.root.children).toHaveLength(1)
  })
})
