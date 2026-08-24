export const LANGUAGES = ['zh', 'en'] as const

export type Language = (typeof LANGUAGES)[number]

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && LANGUAGES.includes(value as Language)
}

export function validateKebabCase(value: unknown): true | string {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
    ? true
    : 'Use lowercase kebab-case.'
}

export function buildRouteKey(language: Language, slug: string): string {
  return `${language}:${slug}`
}

export function buildTranslationIdentity(language: Language, translationKey: string): string {
  return `${translationKey}:${language}`
}
