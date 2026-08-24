import {
  faqList,
  requiredText,
  requiredTextarea,
  routedIdentityFields,
  stringList,
} from '@/fields/common'
import { seoField } from '@/fields/seo'

import { routedCollection } from './routed'

export const Projects = routedCollection({
  slug: 'projects',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'language', 'order', '_status'] },
  fields: [
    requiredText('title', 'Title'),
    ...routedIdentityFields,
    requiredText('kind', 'Kind'),
    requiredTextarea('summary', 'Summary'),
    requiredTextarea('definition', 'Definition'),
    requiredTextarea('audience', 'Best for'),
    requiredTextarea('overview', 'Overview'),
    requiredTextarea('why', 'Why it matters'),
    stringList('outcomes', 'Outcomes'),
    stringList('workflow', 'Workflow'),
    requiredTextarea('next', 'Next steps'),
    faqList(true),
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'order', type: 'number', required: true, min: 0, defaultValue: 0 },
    seoField,
  ],
})
