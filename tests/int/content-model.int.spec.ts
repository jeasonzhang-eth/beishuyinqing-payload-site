import type { Field } from 'payload'
import { describe, expect, it } from 'vitest'

import { Notes } from '@/collections/Notes'
import { Projects } from '@/collections/Projects'
import { Services } from '@/collections/Services'
import { buildRouteKey, buildTranslationIdentity, validateKebabCase } from '@/content/contracts'
import { AboutPage, CompanyPage, ContactPage, HomePage, NotesPage, ProjectsPage, ServicesPage } from '@/globals/pages'
import { SiteCopy } from '@/globals/SiteCopy'
import { SiteSettings } from '@/globals/SiteSettings'

const fieldNames = (fields: Field[]) =>
  fields.map((field) => ('name' in field ? field.name : undefined)).filter(Boolean)

describe('bilingual content model', () => {
  it('registers the three routed collections with drafts', () => {
    for (const collection of [Projects, Services, Notes]) {
      expect(['projects', 'services', 'notes']).toContain(collection.slug)
      expect(collection.versions).toEqual(expect.objectContaining({ drafts: expect.anything() }))
      expect(fieldNames(collection.fields)).toEqual(
        expect.arrayContaining([
          'language',
          'translationKey',
          'slug',
          'sourceId',
          'routeKey',
          'translationIdentity',
          'seo',
        ]),
      )
    }
  })

  it('registers fixed content as versioned globals', () => {
    const globals = [
      SiteSettings,
      SiteCopy,
      HomePage,
      AboutPage,
      CompanyPage,
      ContactPage,
      ServicesPage,
      ProjectsPage,
      NotesPage,
    ]

    expect(globals.map((global) => global.slug)).toEqual([
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
    for (const global of globals) {
      expect(global.versions).toEqual(expect.objectContaining({ drafts: expect.anything() }))
    }
    for (const global of globals.slice(1)) {
      expect(fieldNames(global.fields)).toEqual(expect.arrayContaining(['zh', 'en']))
    }
  })

  it('builds stable route and translation identities', () => {
    expect(buildRouteKey('zh', 'creator-tools')).toBe('zh:creator-tools')
    expect(buildTranslationIdentity('en', 'creator-tools')).toBe('creator-tools:en')
    expect(validateKebabCase('creator-tools')).toBe(true)
    expect(validateKebabCase('Creator Tools')).toBe('Use lowercase kebab-case.')
  })
})
