import { requiredText, requiredTextarea, routedIdentityFields, stringList } from '@/fields/common'
import { seoField } from '@/fields/seo'

import { routedCollection } from './routed'

export const Services = routedCollection({
  slug: 'services',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'language', 'order', '_status'] },
  fields: [
    requiredText('title', 'Title'),
    ...routedIdentityFields,
    requiredTextarea('summary', 'Summary'),
    requiredTextarea('bestFor', 'Best for'),
    stringList('deliverables', 'Deliverables'),
    stringList('process', 'Process'),
    requiredTextarea('evidence', 'Evidence'),
    requiredTextarea('boundaries', 'Boundaries'),
    { name: 'enabled', type: 'checkbox', defaultValue: true },
    { name: 'order', type: 'number', required: true, min: 0, defaultValue: 0 },
    seoField,
  ],
})
