import type { ReactNode } from 'react'

import type { SiteData } from '@/lib/site/data'
import type { Language } from '@/lib/site/routes'

import { SiteHeader } from './site-header'

export function SiteFrame({
  children,
  data,
  language,
  alternatePath,
}: {
  children: ReactNode
  data: SiteData
  language: Language
  alternatePath: string
}) {
  const copy = data.copy[language]
  const companyName = language === 'zh' ? data.settings.legalNameZh : data.settings.legalNameEn
  const address = language === 'zh' ? data.settings.addressZh : data.settings.addressEn

  return (
    <div className="site-shell">
      <SiteHeader
        alternatePath={alternatePath}
        copy={copy}
        language={language}
        settings={data.settings}
      />
      <main className="page-main">{children}</main>
      <footer className="site-footer">
        <div className="footer-identity">
          <p>{data.settings.authorName}</p>
          <strong>{companyName}</strong>
        </div>
        <div className="footer-details">
          <div>
            <span>{copy.footerContact}</span>
            <a href={data.settings.phoneHref}>{data.settings.phoneDisplay}</a>
          </div>
          <div>
            <span>{copy.footerOffice}</span>
            <p>{address}</p>
          </div>
        </div>
        <div className="footer-legal">
          <span>
            &copy; {new Date().getUTCFullYear()} {data.settings.shortNameEn}
          </span>
          <a href={data.settings.icpUrl} rel="noopener noreferrer" target="_blank">
            {data.settings.icpNumber}
          </a>
        </div>
      </footer>
    </div>
  )
}
