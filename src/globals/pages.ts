import type { Field, GlobalConfig } from 'payload'

import { globalAccess } from '@/access'
import { requiredText, requiredTextarea, stringList } from '@/fields/common'
import { languageGroups, localizedPageBaseFields } from '@/fields/localized-page'
import { seoField } from '@/fields/seo'

const pageGlobal = (slug: string, label: string, fields: Field[]): GlobalConfig => ({
  slug,
  label,
  access: globalAccess,
  versions: { drafts: { autosave: true }, max: 30 },
  fields: languageGroups(fields),
})

export const HomePage = pageGlobal('home-page', 'Home page', [
  ...localizedPageBaseFields(),
  requiredText('identity', 'Identity'),
  requiredText('primaryActionsLabel', 'Primary actions label'),
  requiredText('artworkAlt', 'Artwork alternative text'),
  requiredText('artworkCaption', 'Artwork caption'),
  requiredText('servicesTitle', 'Services title'),
  requiredTextarea('servicesIntro', 'Services introduction'),
  requiredText('methodEyebrow', 'Method eyebrow'),
  requiredText('methodTitle', 'Method title'),
  stringList('methodSteps', 'Method steps'),
  requiredText('companyEyebrow', 'Company eyebrow'),
  requiredText('companyTitle', 'Company title'),
  requiredTextarea('companyText', 'Company text'),
])

export const AboutPage = pageGlobal('about-page', 'About page', [
  ...localizedPageBaseFields(),
  requiredText('experienceTitle', 'Experience title'),
  stringList('experience', 'Experience'),
  requiredText('focusTitle', 'Focus title'),
  stringList('focus', 'Focus'),
  requiredText('workTitle', 'Work title'),
  stringList('work', 'Work'),
  requiredText('contactTitle', 'Contact title'),
  requiredTextarea('contact', 'Contact text'),
])

export const CompanyPage = pageGlobal('company-page', 'Company page', [
  ...localizedPageBaseFields(),
  requiredText('artworkAlt', 'Artwork alternative text'),
  requiredText('artworkCaption', 'Artwork caption'),
  requiredText('relationshipTitle', 'Relationship title'),
  requiredTextarea('relationship', 'Relationship'),
  requiredText('fieldsTitle', 'Fields title'),
  stringList('fields', 'Fields'),
  requiredText('principlesTitle', 'Principles title'),
  stringList('principles', 'Principles'),
  requiredText('missionTitle', 'Mission title'),
  requiredTextarea('mission', 'Mission'),
  requiredText('ctaTitle', 'CTA title'),
  requiredTextarea('ctaText', 'CTA text'),
  requiredText('ctaLabel', 'CTA label'),
])

export const ContactPage = pageGlobal('contact-page', 'Contact page', [
  ...localizedPageBaseFields(),
  requiredText('companyLabel', 'Company label'),
  requiredText('phoneLabel', 'Phone label'),
  requiredText('addressLabel', 'Address label'),
  requiredText('icpLabel', 'ICP label'),
  requiredText('callAction', 'Call action'),
  requiredTextarea('callDescription', 'Call description'),
  requiredText('cooperationTitle', 'Cooperation title'),
  requiredTextarea('cooperationText', 'Cooperation text'),
])

export const ServicesPage = pageGlobal('services-page', 'Services page', [
  ...localizedPageBaseFields(),
  requiredText('artworkAlt', 'Artwork alternative text'),
  requiredText('artworkCaption', 'Artwork caption'),
  requiredText('bestForLabel', 'Best-for label'),
  requiredText('deliverablesLabel', 'Deliverables label'),
  requiredText('processLabel', 'Process label'),
  requiredText('evidenceLabel', 'Evidence label'),
  requiredText('boundariesLabel', 'Boundaries label'),
  requiredText('ctaTitle', 'CTA title'),
  requiredTextarea('ctaText', 'CTA text'),
  requiredText('ctaLabel', 'CTA label'),
])

const collectionPageFields = [
  requiredText('title', 'SEO title'),
  requiredTextarea('description', 'SEO description'),
  requiredText('eyebrow', 'Eyebrow'),
  seoField,
]

export const ProjectsPage = pageGlobal('projects-page', 'Projects page', collectionPageFields)
export const NotesPage = pageGlobal('notes-page', 'Notes page', collectionPageFields)
