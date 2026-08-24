import type { GlobalConfig } from 'payload'

import { globalAccess } from '@/access'
import { requiredText } from '@/fields/common'
import { languageGroups } from '@/fields/localized-page'

const copyFields = [
  'languageName',
  'siteControlsLabel',
  'primaryNavigationLabel',
  'redirectMessage',
  'redirectLinkLabel',
  'alternateLanguage',
  'themeLight',
  'themeDark',
  'viewWork',
  'readNotes',
  'contactAction',
  'selectedWork',
  'currentNotes',
  'workspace',
  'activeThreads',
  'projectsTitle',
  'notesTitle',
  'projectLabel',
  'noteLabel',
  'servicesLabel',
  'companyLabel',
  'aboutLabel',
  'contactLabel',
  'definition',
  'bestFor',
  'overview',
  'whyItMatters',
  'outcomes',
  'workflow',
  'principles',
  'checklist',
  'examples',
  'nextSteps',
  'faq',
  'footerCompany',
  'footerContact',
  'footerOffice',
] as const

export const SiteCopy: GlobalConfig = {
  slug: 'site-copy',
  label: 'Shared site copy',
  access: globalAccess,
  versions: { drafts: { autosave: true }, max: 30 },
  fields: languageGroups(copyFields.map((name) => requiredText(name, name))),
}
