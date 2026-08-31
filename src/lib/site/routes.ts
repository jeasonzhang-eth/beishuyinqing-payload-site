export const LANGUAGES = ['zh', 'en'] as const

export type Language = (typeof LANGUAGES)[number]

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && LANGUAGES.includes(value as Language)
}

export function alternateLanguage(language: Language): Language {
  return language === 'zh' ? 'en' : 'zh'
}

export function localizePath(language: Language, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '')
  return clean ? `/${language}/${clean}/` : `/${language}/`
}

export function canonicalUrl(siteUrl: string, pathname: string): string {
  return `${siteUrl.replace(/\/+$/, '')}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

export function values(rows: Array<{ value: string }> | null | undefined): string[] {
  return rows?.map((row) => row.value) ?? []
}

export function lexicalPlainText(value: unknown): string {
  const text: string[] = []
  const visit = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const record = node as Record<string, unknown>
    if (typeof record.text === 'string') text.push(record.text)
    if (Array.isArray(record.children)) {
      for (const child of record.children) visit(child)
      if (record.type === 'paragraph' || record.type === 'heading' || record.type === 'listitem') {
        text.push('\n')
      }
    }
    if (record.root) visit(record.root)
  }
  visit(value)
  return text
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
