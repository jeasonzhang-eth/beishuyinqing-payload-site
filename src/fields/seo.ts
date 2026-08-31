import type { Field } from 'payload'

export const seoField: Field = {
  name: 'seo',
  label: 'SEO overrides',
  type: 'group',
  fields: [
    { name: 'title', type: 'text', maxLength: 65 },
    { name: 'description', type: 'textarea', maxLength: 170 },
    {
      name: 'keywords',
      type: 'array',
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    { name: 'noIndex', type: 'checkbox', defaultValue: false },
  ],
}
