import type { ReactNode } from 'react'

import { isLanguage } from '@/lib/site/routes'

import '../site.css'
import '../brand.css'

const themeScript = `(() => {
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch {}
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = saved || (dark ? 'dark' : 'light');
})();`

export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const language = isLanguage(lang) ? lang : 'zh'
  return (
    <html data-theme="light" lang={language === 'zh' ? 'zh-CN' : 'en'} suppressHydrationWarning>
      <head>
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
