import type { Field } from 'payload'

import { requiredText, requiredTextarea, stringList } from './common'
import { seoField } from './seo'

export const localizedPageBaseFields = (): Field[] => [
  requiredText('title', 'SEO title'),
  requiredTextarea('description', 'SEO description'),
  requiredText('eyebrow', 'Eyebrow'),
  requiredTextarea('headline', 'Headline'),
  stringList('headlineLines', 'Headline display lines'),
  requiredTextarea('lede', 'Introduction'),
  seoField,
]

export const languageGroups = (fields: Field[]): Field[] => [
  { name: 'zh', label: '中文', type: 'group', fields },
  { name: 'en', label: 'English', type: 'group', fields },
]
