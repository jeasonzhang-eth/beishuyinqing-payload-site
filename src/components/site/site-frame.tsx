import type { ReactNode } from 'react'

import type { SiteData } from '@/lib/site/data'
import type { Language } from '@/lib/site/routes'

import { SiteHeader } from './site-header'
import { BrandLogo } from './brand-assets'

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
      <a className="skip-link" href="#main-content">
        {language === 'zh' ? '跳到主要内容' : 'Skip to main content'}
      </a>
      <SiteHeader
        alternatePath={alternatePath}
        copy={copy}
        language={language}
        settings={data.settings}
      />
      <main className="page-main" id="main-content">
        {children}
      </main>
      <footer className="site-footer">
        <div className="footer-identity">
          <BrandLogo className="footer-logo" tone="white" />
          <strong>{companyName}</strong>
          <p>
            {language === 'zh'
              ? `${data.settings.authorName} · 创始人及交付负责人`
              : `${data.settings.authorName} · Founder and delivery lead`}
          </p>
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
