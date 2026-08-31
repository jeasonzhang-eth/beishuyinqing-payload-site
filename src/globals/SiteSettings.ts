import type { GlobalConfig } from 'payload'

import { globalAccess } from '@/access'
import { requiredText, requiredTextarea } from '@/fields/common'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: globalAccess,
  versions: { drafts: { autosave: true }, max: 30 },
  fields: [
    requiredText('siteName', 'Site name'),
    requiredText('siteUrl', 'Canonical site URL'),
    requiredText('authorName', 'Author name'),
    requiredText('githubUrl', 'Author GitHub URL'),
    requiredTextarea('llmsDescription', 'llms.txt entity description'),
    {
      name: 'defaultLanguage',
      type: 'select',
      required: true,
      defaultValue: 'zh',
      options: [
        { label: '中文', value: 'zh' },
        { label: 'English', value: 'en' },
      ],
    },
    requiredText('legalNameZh', 'Legal name - Chinese'),
    requiredText('legalNameEn', 'Legal name - English'),
    requiredText('shortNameZh', 'Short name - Chinese'),
    requiredText('shortNameEn', 'Short name - English'),
    requiredText('phoneDisplay', 'Phone display'),
    requiredText('phoneHref', 'Phone link'),
    requiredTextarea('addressZh', 'Address - Chinese'),
    requiredTextarea('addressEn', 'Address - English'),
    requiredText('cityZh', 'City - Chinese'),
    requiredText('cityEn', 'City - English'),
    requiredText('postalCode', 'Postal code'),
    requiredText('countryCode', 'Country code'),
    requiredText('icpNumber', 'ICP number'),
    requiredText('icpUrl', 'ICP URL'),
    requiredText('verificationFile', 'Verification filename'),
    requiredText('defaultSeoTitle', 'Default SEO title'),
    requiredTextarea('defaultSeoDescription', 'Default SEO description'),
    { name: 'defaultShareImage', type: 'upload', relationTo: 'media' },
  ],
}
