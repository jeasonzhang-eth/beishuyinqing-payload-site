# Multiple Engine Payload + Next.js Migration Design

## Purpose

Replace the split Astro + Sanity implementation with one self-hosted Payload application that owns the editor, API, media, and public Next.js website for `beishuyinqing.cn`.

The current production website remains unchanged during this work. Cutover is a separate production operation after content, route, visual, backup, and rollback checks pass.

## Goals

- Preserve the current Chinese and English public routes, content, metadata, structured data, and visual identity.
- Provide a Payload Admin UI at `/admin` for editing the complete website.
- Keep drafts and versions separate from public content.
- Import the current public Sanity dataset without requiring Sanity after migration.
- Make local development reproducible from the repository.
- Keep the first deployment suitable for one small Tencent Cloud server.

## Non-goals

- No production DNS, Nginx, Cloudflare, or release switch in this migration task.
- No multi-tenant CMS, workflow engine, external API Core, or distributed build system.
- No redesign of the existing website.
- No deletion or mutation of the current Astro and Sanity repositories or datasets.

## Architecture

One Payload project runs as a Next.js application:

```text
Browser
  -> Nginx / Cloudflare (future production cutover)
  -> Payload + Next.js
       -> /admin: Payload Admin UI
       -> /api: Payload REST API
       -> /zh and /en: public Next.js routes
       -> Payload Local API
            -> SQLite database
            -> persistent media directory
```

The public website reads Payload through the Local API on the server. It is therefore not a separate headless consumer and does not make browser-side CMS API requests.

SQLite is the initial database because this is a low-write, single-site, single-instance workload. The database and media directory must live on persistent storage and be backed up together. PostgreSQL becomes necessary before horizontal scaling or multiple concurrent application instances.

## Content Model

### Authentication and media

- `users`: Payload authentication collection; admin access only.
- `media`: upload collection with required alternative text and image metadata.

### Globals

- `site-settings`: canonical URL, company identity, contact facts, ICP information, default SEO, and verification filename.
- `site-copy`: Chinese and English shared navigation, labels, actions, and footer copy.
- `home-page`, `about-page`, `company-page`, `contact-page`, `services-page`, `projects-page`, and `notes-page`: one global per page type with explicit Chinese and English groups.

Globals replace the fixed-ID Sanity singleton documents. Explicit language groups keep page editing compact and avoid Payload fallback silently substituting one language for another.

### Collections

- `projects`: one document per language, paired by `translationKey`.
- `services`: one document per language, paired by `translationKey`.
- `notes`: one document per language, paired by `translationKey`; body uses Payload Lexical rich text.

The collections retain the existing `language + translationKey` contract. This minimizes route and validation changes, permits independent publication per language, and makes migration equality measurable.

Projects, services, notes, and editable globals use Payload versions and drafts. Public queries explicitly require `_status = published` and disable locale fallback behavior.

## Migration

1. Export the public Sanity content into a versioned JSON snapshot.
2. Validate the snapshot before importing: exactly 39 fixed site documents, all required bilingual pairs, unique routes, and all published Notes.
3. Convert Sanity Portable Text into Payload Lexical JSON using a deterministic transformer.
4. Import Globals first, followed by Projects, Services, Notes, and referenced Media.
5. Store original Sanity IDs on imported collection records for audit and idempotent re-imports.
6. Verify source and destination counts, translation keys, slugs, FAQ counts, public text, and media references.

The importer must be idempotent. Re-running it updates the same records instead of creating duplicates.

## Public Routes

The Next.js frontend preserves:

- `/` -> `/zh/`
- `/zh/` and `/en/`
- `/{lang}/about/`
- `/{lang}/company/`
- `/{lang}/contact/`
- `/{lang}/services/`
- `/{lang}/projects/`
- `/{lang}/projects/{slug}/`
- `/{lang}/notes/`
- `/{lang}/notes/{slug}/`
- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`
- the existing verification file route

Canonical URLs, hreflang links, `x-default`, JSON-LD, no-index behavior, Sitemap membership, and `llms.txt` discovery rules remain equivalent to the Astro implementation.

## Rendering and Editing

- Public pages are React Server Components and query Payload on the server.
- Published content is cached and invalidated by Payload `afterChange` hooks.
- Draft Preview uses Next.js draft mode and authenticated preview URLs.
- Publishing content updates the website without a separate Astro build.
- A CMS/database failure may prevent dynamic page generation, so production caching and the previous release remain part of the eventual cutover design.

## Failure Handling

- Invalid or incomplete required content fails the seed/import command with document-level errors.
- Public route loaders return `notFound()` for missing optional records and fail loudly for missing required Globals.
- Failed imports leave the source snapshot untouched and report the last successfully processed object.
- Production deployment must retain the current static release until the Payload application passes health, route, content, media, and browser checks.
- Database and media backups must be restorable as one release boundary.

## Verification

- Unit tests cover language/slug rules, Sanity-to-Payload transformation, pairing, and discovery serialization.
- Import verification compares source and Payload counts and stable business fields.
- Next.js build must complete without contacting Sanity.
- Route tests cover all expected bilingual pages, metadata, Sitemap, `llms.txt`, JSON-LD, and the verification route.
- Browser checks cover desktop and mobile layouts, light and dark themes, navigation, detail pages, rich text, images, and horizontal overflow.
- `/admin` and Payload health/API endpoints must load locally.

## Repository and Release Boundary

- New repository: `jeasonzhang-eth/beishuyinqing-payload-site`.
- Parent submodule path: `code/personal/beishuyinqing-payload-site`.
- Old repositories remain independent migration sources and rollback references.
- This task ends with a locally verified application and pushed source repository. Production cutover remains an explicit later task.
