import type { Field } from 'payload'

import { LANGUAGES, validateKebabCase } from '@/content/contracts'

export const requiredText = (name: string, label: string): Field => ({
  name,
  label,
  type: 'text',
  required: true,
})

export const requiredTextarea = (name: string, label: string): Field => ({
  name,
  label,
  type: 'textarea',
  required: true,
})

export const stringList = (name: string, label: string): Field => ({
  name,
  label,
  type: 'array',
  required: true,
  minRows: 1,
  fields: [requiredText('value', 'Value')],
})

export const faqList = (required = false): Field => ({
  name: 'faq',
  label: 'FAQ',
  type: 'array',
  required,
  minRows: required ? 1 : undefined,
  fields: [requiredText('question', 'Question'), requiredTextarea('answer', 'Answer')],
})

export const languageField: Field = {
  name: 'language',
  label: 'Language',
  type: 'select',
  required: true,
  options: LANGUAGES.map((value) => ({ label: value === 'zh' ? '中文' : 'English', value })),
}

export const routedIdentityFields: Field[] = [
  languageField,
  {
    name: 'translationKey',
    label: 'Translation key',
    type: 'text',
    required: true,
    validate: validateKebabCase,
  },
  {
    name: 'slug',
    type: 'text',
    required: true,
    index: true,
    validate: validateKebabCase,
  },
  {
    name: 'sourceId',
    label: 'Original Sanity ID',
    type: 'text',
    unique: true,
    index: true,
    admin: { readOnly: true },
  },
  {
    name: 'routeKey',
    type: 'text',
    unique: true,
    index: true,
    admin: { hidden: true },
  },
  {
    name: 'translationIdentity',
    type: 'text',
    unique: true,
    index: true,
    admin: { hidden: true },
  },
]
