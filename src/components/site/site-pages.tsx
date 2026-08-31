import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

import type { Note, Project } from '@/payload-types'
import type { SiteData } from '@/lib/site/data'
import {
  alternateLanguage,
  lexicalPlainText,
  localizePath,
  type Language,
  values,
} from '@/lib/site/routes'

import { DisplayHeadline } from './display-headline'
import { BrandField, BrandMark, CapabilityIcon } from './brand-assets'
import { JsonLd } from './json-ld'

function localized<T extends { language: Language }>(items: T[], language: Language): T[] {
  return items.filter((item) => item.language === language)
}

export function Home({ data, language }: { data: SiteData; language: Language }) {
  const page = data.home[language]
  const copy = data.copy[language]
  const projects = localized(data.projects, language)
  const services = localized(data.services, language)
  const notes = localized(data.notes, language)
  const organizationName = language === 'zh' ? data.settings.legalNameZh : data.settings.legalNameEn
  const brandName = language === 'zh' ? data.settings.shortNameZh : data.settings.shortNameEn
  const pathname = localizePath(language)
  const capabilities = services.slice(0, 4)
  const foundations = services.slice(4)

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: data.settings.authorName,
            url: `${data.settings.siteUrl}${localizePath(language, 'about')}`,
            sameAs: [data.settings.githubUrl],
            worksFor: { '@type': 'Organization', name: organizationName },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: organizationName,
            url: `${data.settings.siteUrl}${localizePath(language, 'company')}`,
            telephone: data.settings.phoneDisplay,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: brandName,
            url: `${data.settings.siteUrl}${pathname}`,
            inLanguage: language === 'zh' ? 'zh-CN' : 'en',
            description: page.description,
          },
        ]}
      />
      <section aria-labelledby="hero-title" className="hero integrated-hero brand-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            {language === 'zh'
              ? 'MULTIPLE ENGINE · 企业 AI 与软件系统'
              : 'MULTIPLE ENGINE · Enterprise AI and software systems'}
          </p>
          <h1 className="hero-brand-name" id="hero-title">
            {brandName}
          </h1>
          <h2 aria-label={page.headline} className="hero-statement">
            {values(page.headlineLines).map((line) => (
              <span aria-hidden="true" key={line}>
                {line}
              </span>
            ))}
          </h2>
          <p className="lede">{page.lede}</p>
          <div aria-label={page.primaryActionsLabel} className="hero-actions">
            <a className="button primary" href="#work">
              {copy.viewWork}
            </a>
            <Link className="button secondary" href={localizePath(language, 'contact')}>
              {copy.contactAction}
            </Link>
          </div>
        </div>
        <BrandField language={language} />
      </section>

      <section aria-labelledby="work-title" className="section proof-section" id="work">
        <div className="section-heading">
          <p className="eyebrow">{copy.selectedWork}</p>
          <h2 id="work-title">{copy.projectsTitle}</h2>
        </div>
        <div className="project-list">
          {projects.map((project, index) => (
            <Link
              className="project-card project-link"
              href={localizePath(language, `projects/${project.slug}`)}
              key={project.id}
            >
              <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p>{project.kind}</p>
                <h3>{project.title}</h3>
              </div>
              <span>{project.summary}</span>
              <span aria-hidden="true" className="row-arrow">
                -&gt;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="services-title" className="home-services">
        <div className="section-heading">
          <p className="eyebrow">{copy.servicesLabel}</p>
          <h2 id="services-title">{page.servicesTitle}</h2>
          <p>{page.servicesIntro}</p>
        </div>
        <div className="home-service-grid">
          {capabilities.map((service, index) => (
            <Link
              className="home-service-card"
              href={`${localizePath(language, 'services')}#${service.slug}`}
              key={service.id}
            >
              <div className="capability-card__topline">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <CapabilityIcon index={index} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
            </Link>
          ))}
        </div>
        {foundations.map((service) => (
          <Link
            className="delivery-foundation"
            href={`${localizePath(language, 'services')}#${service.slug}`}
            key={service.id}
          >
            <span>{language === 'zh' ? '交付底座' : 'Delivery foundation'}</span>
            <strong>{service.title}</strong>
            <p>{service.summary}</p>
            <span aria-hidden="true" className="row-arrow">
              -&gt;
            </span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="method-title" className="method-section">
        <div className="section-heading">
          <p className="eyebrow">{page.methodEyebrow}</p>
          <h2 id="method-title">{page.methodTitle}</h2>
        </div>
        <ol className="method-list">
          {values(page.methodSteps).map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="notes-title" className="section notes insight-section" id="notes">
        <div className="section-heading">
          <p className="eyebrow">{copy.currentNotes}</p>
          <h2 id="notes-title">{copy.notesTitle}</h2>
        </div>
        <ul className="note-tags insight-list">
          {notes.map((note) => (
            <li key={note.id}>
              <Link href={localizePath(language, `notes/${note.slug}`)}>
                <span>{note.tags?.[0]?.value || copy.noteLabel}</span>
                <strong>{note.title}</strong>
                <small>{note.summary}</small>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="closing-panel home-company-panel">
        <p className="eyebrow">{page.companyEyebrow}</p>
        <h2>{page.companyTitle}</h2>
        <p>{page.companyText}</p>
        <div className="panel-actions">
          <Link className="button primary" href={localizePath(language, 'company')}>
            {copy.companyLabel}
          </Link>
          <Link className="button secondary" href={localizePath(language, 'contact')}>
            {copy.contactAction}
          </Link>
        </div>
      </section>
    </>
  )
}

export function About({ data, language }: { data: SiteData; language: Language }) {
  const page = data.about[language]
  const organizationName = language === 'zh' ? data.settings.legalNameZh : data.settings.legalNameEn
  return (
    <article className="content-page about-page">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: data.settings.authorName,
          description: page.description,
          sameAs: [data.settings.githubUrl],
          worksFor: { '@type': 'Organization', name: organizationName },
        }}
      />
      <p className="eyebrow">{page.eyebrow}</p>
      <DisplayHeadline
        ariaLabel={page.headline}
        language={language}
        lines={values(page.headlineLines)}
      />
      <p className="lede">{page.lede}</p>
      <div aria-label={page.title} className="about-panel">
        <BrandMark className="about-brand-mark" />
        <div>
          <p>{data.settings.authorName}</p>
          <span>{page.description}</span>
        </div>
      </div>
      <div className="content-grid">
        <ListSection items={values(page.experience)} title={page.experienceTitle} />
        <ListSection items={values(page.focus)} title={page.focusTitle} />
        <ListSection items={values(page.work)} title={page.workTitle} />
        <section>
          <h2>{page.contactTitle}</h2>
          <p>{page.contact}</p>
        </section>
      </div>
    </article>
  )
}

export function Company({ data, language }: { data: SiteData; language: Language }) {
  const page = data.company[language]
  const organizationName = language === 'zh' ? data.settings.legalNameZh : data.settings.legalNameEn
  const otherName = language === 'zh' ? data.settings.legalNameEn : data.settings.legalNameZh
  const address = language === 'zh' ? data.settings.addressZh : data.settings.addressEn
  return (
    <article className="content-page company-page">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: organizationName,
          alternateName: otherName,
          telephone: data.settings.phoneDisplay,
          address,
          description: page.description,
        }}
      />
      <p className="eyebrow">{page.eyebrow}</p>
      <DisplayHeadline
        ariaLabel={page.headline}
        language={language}
        lines={values(page.headlineLines)}
      />
      <p className="lede">{page.lede}</p>
      <BrandField language={language} variant="company" />
      <div aria-label={organizationName} className="company-stamp">
        <BrandMark className="company-stamp__mark" />
        <div>
          <strong>{organizationName}</strong>
          <p>{otherName}</p>
        </div>
      </div>
      <div className="content-grid company-content">
        <TextSection text={page.relationship} title={page.relationshipTitle} />
        <ListSection items={values(page.fields)} title={page.fieldsTitle} />
        <ListSection items={values(page.principles)} ordered title={page.principlesTitle} />
        <TextSection text={page.mission} title={page.missionTitle} />
      </div>
      <ClosingPanel
        eyebrow={data.settings.shortNameEn}
        href={localizePath(language, 'contact')}
        label={page.ctaLabel}
        text={page.ctaText}
        title={page.ctaTitle}
      />
    </article>
  )
}

export function Contact({ data, language }: { data: SiteData; language: Language }) {
  const page = data.contact[language]
  const organizationName = language === 'zh' ? data.settings.legalNameZh : data.settings.legalNameEn
  const address = language === 'zh' ? data.settings.addressZh : data.settings.addressEn
  return (
    <article className="content-page contact-page">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: page.title,
          description: page.description,
          about: {
            '@type': 'Organization',
            name: organizationName,
            telephone: data.settings.phoneDisplay,
            address,
          },
        }}
      />
      <p className="eyebrow">{page.eyebrow}</p>
      <DisplayHeadline
        ariaLabel={page.headline}
        language={language}
        lines={values(page.headlineLines)}
      />
      <p className="lede">{page.lede}</p>
      <div className="contact-layout">
        <a className="contact-call" href={data.settings.phoneHref}>
          <span className="contact-call__content">
            <span className="contact-call__label">{page.phoneLabel}</span>
            <strong>{data.settings.phoneDisplay}</strong>
            <span className="contact-call__description">{page.callDescription}</span>
          </span>
          <span className="contact-cta">
            <span>{page.callAction}</span>
            <span aria-hidden="true">-&gt;</span>
          </span>
        </a>
        <dl className="contact-facts">
          <div>
            <dt>{page.companyLabel}</dt>
            <dd>{organizationName}</dd>
          </div>
          <div>
            <dt>{page.addressLabel}</dt>
            <dd>{address}</dd>
          </div>
          <div>
            <dt>{page.icpLabel}</dt>
            <dd>
              <a href={data.settings.icpUrl} rel="noopener noreferrer" target="_blank">
                {data.settings.icpNumber}
              </a>
            </dd>
          </div>
        </dl>
      </div>
      <section className="contact-context">
        <h2>{page.cooperationTitle}</h2>
        <p>{page.cooperationText}</p>
        <Link className="text-link" href={localizePath(language, 'services')}>
          {language === 'zh' ? '查看服务范围' : 'Review service scope'}
        </Link>
      </section>
    </article>
  )
}

export function Services({ data, language }: { data: SiteData; language: Language }) {
  const page = data.servicesPage[language]
  const services = localized(data.services, language)
  const organizationName = language === 'zh' ? data.settings.legalNameZh : data.settings.legalNameEn
  return (
    <article className="content-page service-page">
      <JsonLd
        data={services.map((service) => ({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          provider: { '@type': 'Organization', name: organizationName },
          areaServed: data.settings.countryCode,
        }))}
      />
      <p className="eyebrow">{page.eyebrow}</p>
      <DisplayHeadline
        ariaLabel={page.headline}
        language={language}
        lines={values(page.headlineLines)}
      />
      <p className="lede">{page.lede}</p>
      <BrandField language={language} variant="systems" />
      <nav aria-label={page.title} className="service-index">
        {services.map((service, index) => (
          <a href={`#${service.slug}`} key={service.id}>
            <span>{index < 4 ? String(index + 1).padStart(2, '0') : 'BASE'}</span>
            {index < 4 ? (
              <CapabilityIcon index={index} />
            ) : (
              <BrandMark className="service-index__foundation-mark" />
            )}
            <strong>{service.title}</strong>
          </a>
        ))}
      </nav>
      <div className="service-detail-list">
        {services.map((service, index) => (
          <section className="service-detail" id={service.slug} key={service.id}>
            <div aria-hidden="true" className="service-number">
              {index < 4 ? String(index + 1).padStart(2, '0') : 'BASE'}
            </div>
            <div className="service-body">
              <div className="service-heading-row">
                {index < 4 ? (
                  <CapabilityIcon index={index} />
                ) : (
                  <BrandMark className="service-heading__foundation-mark" />
                )}
                <h2>{service.title}</h2>
              </div>
              <p className="service-summary">{service.summary}</p>
              <div className="service-facts">
                <TextSection text={service.bestFor} title={page.bestForLabel} />
                <ListSection items={values(service.deliverables)} title={page.deliverablesLabel} />
                <ListSection items={values(service.process)} ordered title={page.processLabel} />
                <TextSection text={service.evidence} title={page.evidenceLabel} />
                <TextSection text={service.boundaries} title={page.boundariesLabel} />
              </div>
            </div>
          </section>
        ))}
      </div>
      <ClosingPanel
        eyebrow={page.eyebrow}
        href={localizePath(language, 'contact')}
        label={page.ctaLabel}
        text={page.ctaText}
        title={page.ctaTitle}
      />
    </article>
  )
}

export function Projects({ data, language }: { data: SiteData; language: Language }) {
  const page = data.projectsPage[language]
  return (
    <section aria-labelledby="projects-title" className="content-page collection-page">
      <p className="eyebrow">{page.eyebrow}</p>
      <h1 id="projects-title">{page.title}</h1>
      <p className="lede">{page.description}</p>
      <div className="directory-list">
        {localized(data.projects, language).map((project) => (
          <Link
            className="directory-card"
            href={localizePath(language, `projects/${project.slug}`)}
            key={project.id}
          >
            <p>{project.kind}</p>
            <h2>{project.title}</h2>
            <span>{project.summary}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function ProjectDetail({
  data,
  language,
  project,
}: {
  data: SiteData
  language: Language
  project: Project
}) {
  const copy = data.copy[language]
  return (
    <article className="content-page">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.summary,
            author: { '@type': 'Person', name: data.settings.authorName },
            inLanguage: language === 'zh' ? 'zh-CN' : 'en',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: project.faq.map((entry) => ({
              '@type': 'Question',
              name: entry.question,
              acceptedAnswer: { '@type': 'Answer', text: entry.answer },
            })),
          },
        ]}
      />
      <p className="eyebrow breadcrumb">
        <Link href={localizePath(language, 'projects')}>{copy.projectLabel}</Link> / {project.kind}
      </p>
      <h1>{project.title}</h1>
      <p className="lede">{project.summary}</p>
      <div className="content-grid">
        <TextSection text={project.definition} title={copy.definition} />
        <TextSection text={project.audience} title={copy.bestFor} />
        <TextSection text={project.overview} title={copy.overview} />
        <TextSection text={project.why} title={copy.whyItMatters} />
        <ListSection items={values(project.outcomes)} title={copy.outcomes} />
        <ListSection items={values(project.workflow)} ordered title={copy.workflow} />
        <TextSection text={project.next} title={copy.nextSteps} />
        <section>
          <h2>{copy.faq}</h2>
          <div className="faq-list">
            {project.faq.map((entry) => (
              <details key={entry.id || entry.question}>
                <summary>{entry.question}</summary>
                <p>{entry.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </article>
  )
}

export function Notes({ data, language }: { data: SiteData; language: Language }) {
  const page = data.notesPage[language]
  const copy = data.copy[language]
  return (
    <section aria-labelledby="notes-title" className="content-page collection-page">
      <p className="eyebrow">{page.eyebrow}</p>
      <h1 id="notes-title">{page.title}</h1>
      <p className="lede">{page.description}</p>
      <div className="directory-list">
        {localized(data.notes, language).map((note) => (
          <Link
            className="directory-card"
            href={localizePath(language, `notes/${note.slug}`)}
            key={note.id}
          >
            <p>{note.tags?.[0]?.value || copy.noteLabel}</p>
            <h2>{note.title}</h2>
            <span>{note.summary}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function NoteDetail({
  data,
  language,
  note,
}: {
  data: SiteData
  language: Language
  note: Note
}) {
  const copy = data.copy[language]
  const tag = note.tags?.[0]?.value || copy.noteLabel
  return (
    <article className="content-page">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: note.title,
            description: note.seo?.description || note.summary,
            articleBody: lexicalPlainText(note.content),
            author: { '@type': 'Person', name: data.settings.authorName },
            datePublished: note.publishedAt,
            dateModified: note.sourceUpdatedAt || note.publishedAt,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: (note.faq ?? []).map((entry) => ({
              '@type': 'Question',
              name: entry.question,
              acceptedAnswer: { '@type': 'Answer', text: lexicalPlainText(entry.answer) },
            })),
          },
        ]}
      />
      <p className="eyebrow breadcrumb">
        <Link href={localizePath(language, 'notes')}>{copy.noteLabel}</Link> / {tag}
      </p>
      <h1>{note.title}</h1>
      <p className="lede">{note.summary}</p>
      <div className="content-grid">
        <div className="portable-note-body">
          <RichText data={note.content} />
        </div>
        {(note.faq?.length ?? 0) > 0 && (
          <section>
            <h2>{copy.faq}</h2>
            <div className="faq-list">
              {note.faq?.map((entry) => (
                <details key={entry.id || entry.question}>
                  <summary>{entry.question}</summary>
                  <div className="portable-note-body">
                    <RichText data={entry.answer} />
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}

function TextSection({ title, text }: { title: string; text: string }) {
  return (
    <section>
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  )
}

function ListSection({
  title,
  items,
  ordered = false,
}: {
  title: string
  items: string[]
  ordered?: boolean
}) {
  const List = ordered ? 'ol' : 'ul'
  return (
    <section>
      <h2>{title}</h2>
      <List className={`content-list${ordered ? ' ordered' : ''}`}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
    </section>
  )
}

function ClosingPanel({
  eyebrow,
  title,
  text,
  href,
  label,
}: {
  eyebrow: string
  title: string
  text: string
  href: string
  label: string
}) {
  return (
    <section className="closing-panel">
      <BrandMark className="closing-panel__mark" />
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="button primary" href={href}>
        {label}
      </Link>
    </section>
  )
}

export function alternateDetailPath(
  data: SiteData,
  language: Language,
  kind: 'projects' | 'notes',
  item: Project | Note,
): string {
  const otherLanguage = alternateLanguage(language)
  const collection = kind === 'projects' ? data.projects : data.notes
  const alternate = collection.find(
    (candidate) =>
      candidate.translationKey === item.translationKey && candidate.language === otherLanguage,
  )
  return alternate
    ? localizePath(otherLanguage, `${kind}/${alternate.slug}`)
    : localizePath(otherLanguage, kind)
}
