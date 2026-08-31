import { faqList, requiredText, requiredTextarea, routedIdentityFields } from '@/fields/common'
import { seoField } from '@/fields/seo'

import { routedCollection } from './routed'

export const Notes = routedCollection({
  slug: 'notes',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'language', 'publishedAt', '_status'] },
  fields: [
    requiredText('title', 'Title'),
    ...routedIdentityFields,
    requiredTextarea('summary', 'Summary'),
    { name: 'content', type: 'richText', required: true },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    { name: 'publishedAt', type: 'date', required: true },
    { name: 'sourceUpdatedAt', label: 'Original updated time', type: 'date' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    faqList(false, true),
    seoField,
  ],
})
