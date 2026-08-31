'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useSyncExternalStore } from 'react'

import type { SiteCopy, SiteSetting } from '@/payload-types'
import { alternateLanguage, localizePath, type Language } from '@/lib/site/routes'

import { BrandLogo } from './brand-assets'

type LocalizedCopy = SiteCopy[Language]

const themeEvent = 'site-theme-change'

function subscribeTheme(callback: () => void) {
  window.addEventListener(themeEvent, callback)
  return () => window.removeEventListener(themeEvent, callback)
}

function currentThemeIsDark() {
  return document.documentElement.dataset.theme === 'dark'
}

export function SiteHeader({
  language,
  copy,
  settings,
  alternatePath,
}: {
  language: Language
  copy: LocalizedCopy
  settings: SiteSetting
  alternatePath: string
}) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const isDark = useSyncExternalStore(subscribeTheme, currentThemeIsDark, () => false)
  const otherLanguage = alternateLanguage(language)
  const navItems = [
    { href: localizePath(language, 'projects'), label: copy.projectLabel },
    { href: localizePath(language, 'notes'), label: copy.noteLabel },
    { href: localizePath(language, 'services'), label: copy.servicesLabel },
    { href: localizePath(language, 'company'), label: copy.companyLabel },
    { href: localizePath(language, 'about'), label: copy.aboutLabel },
    { href: localizePath(language, 'contact'), label: copy.contactLabel, className: 'nav-contact' },
  ]

  function toggleTheme() {
    const next = currentThemeIsDark() ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // The selected theme still applies for this page view.
    }
    window.dispatchEvent(new Event(themeEvent))
  }

  return (
    <header aria-label={copy.siteControlsLabel} className="site-toolbar">
      <Link
        aria-label={`${language === 'zh' ? settings.shortNameZh : settings.shortNameEn} home`}
        className="brand"
        href={localizePath(language)}
      >
        <BrandLogo className="brand-logo brand-logo--color" priority />
        <BrandLogo className="brand-logo brand-logo--white" priority tone="white" />
      </Link>
      <nav
        aria-label={copy.primaryNavigationLabel}
        className={`site-nav${menuOpen ? ' is-open' : ''}`}
        id="primary-navigation"
      >
        {navItems.map((item) => {
          const isCurrent = pathname === item.href || pathname.startsWith(item.href)
          return (
            <Link
              aria-current={isCurrent ? 'page' : undefined}
              className={[item.className, isCurrent ? 'is-current' : ''].filter(Boolean).join(' ')}
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="control-stack">
        <Link className="control-link" href={alternatePath} hrefLang={otherLanguage}>
          {copy.alternateLanguage}
        </Link>
        <button
          aria-label={isDark ? copy.themeLight : copy.themeDark}
          aria-pressed={isDark}
          className="control-button theme-toggle"
          onClick={toggleTheme}
          title={isDark ? copy.themeLight : copy.themeDark}
          type="button"
        >
          <span aria-hidden="true" className="theme-symbol">
            {isDark ? '○' : '●'}
          </span>
        </button>
        <button
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={
            menuOpen
              ? language === 'zh'
                ? '关闭导航'
                : 'Close navigation'
              : language === 'zh'
                ? '打开导航'
                : 'Open navigation'
          }
          className="control-button menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span aria-hidden="true" className="menu-symbol">
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>
  )
}
