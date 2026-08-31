import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '@/access'
import { buildRouteKey, buildTranslationIdentity, isLanguage } from '@/content/contracts'

const populateIdentity: CollectionBeforeValidateHook = ({ data }) => {
  if (!data || !isLanguage(data.language)) return data
  if (typeof data.slug === 'string') data.routeKey = buildRouteKey(data.language, data.slug)
  if (typeof data.translationKey === 'string') {
    data.translationIdentity = buildTranslationIdentity(data.language, data.translationKey)
  }
  return data
}

export const routedCollection = (
  config: Pick<CollectionConfig, 'slug' | 'admin' | 'fields'>,
): CollectionConfig => ({
  ...config,
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: { beforeValidate: [populateIdentity] },
  versions: {
    drafts: { autosave: true },
    maxPerDoc: 30,
  },
})
