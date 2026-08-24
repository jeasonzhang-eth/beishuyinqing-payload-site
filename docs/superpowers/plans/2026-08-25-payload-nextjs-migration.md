# Multiple Engine Payload + Next.js Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a locally runnable Payload application that includes the Admin UI and a content-equivalent Next.js replacement for the current bilingual Multiple Engine Astro website.

**Architecture:** One Next.js process hosts Payload Admin, Payload APIs, and React Server Component public pages. Payload Local API reads a persistent SQLite database; a deterministic migration snapshot and importer remove the runtime dependency on Sanity.

**Tech Stack:** Payload CMS 3, Next.js, React, TypeScript, SQLite, Lexical rich text, Node test runner, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-25-payload-nextjs-migration-design.md`

## Global Constraints

- Preserve all current Chinese and English routes and public content semantics.
- Do not modify production DNS, Nginx, Cloudflare, or the active Astro release.
- Do not mutate or delete the source Sanity dataset or old repositories.
- Public pages read only published Payload content through the server-side Local API.
- The application must build and run without contacting Sanity after the migration snapshot exists.
- Local SQLite data and uploaded media are persistent runtime state and are not committed.
- Every implementation commit updates `CHANGELOG.md`.

---

### Task 1: Payload Application Foundation

**Files:**
- Create: `package.json`
- Create: `payload.config.ts`
- Create: `next.config.mjs`
- Create: `tsconfig.json`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `src/app/(payload)/admin/[[...segments]]/page.tsx`
- Create: `src/app/(payload)/api/[...slug]/route.ts`
- Create: `src/app/(payload)/layout.tsx`
- Create: `src/collections/Users.ts`
- Create: `src/collections/Media.ts`
- Create: `tests/config.test.ts`
- Create: `CHANGELOG.md`

**Interfaces:**
- Consumes: Payload and Next.js production compatibility requirements.
- Produces: `payload.config.ts`, `/admin`, `/api`, `users`, `media`, and scripts `dev`, `build`, `test`, `seed`, `verify`.

- [ ] Write a config test that imports collection configs and asserts unique slugs `users` and `media`, authentication on `users`, and upload support on `media`.
- [ ] Run `pnpm test` and verify it fails because the configuration does not exist.
- [ ] Scaffold the Payload blank template with SQLite and add the required scripts and environment contract.
- [ ] Run the config test, `pnpm generate:types`, and `pnpm build`.
- [ ] Update `CHANGELOG.md`, commit with `feat: scaffold Payload website`, and push.

### Task 2: Content Model and Validation

**Files:**
- Create: `src/fields/language.ts`
- Create: `src/fields/seo.ts`
- Create: `src/fields/localized-page.ts`
- Create: `src/collections/Projects.ts`
- Create: `src/collections/Services.ts`
- Create: `src/collections/Notes.ts`
- Create: `src/globals/SiteSettings.ts`
- Create: `src/globals/SiteCopy.ts`
- Create: `src/globals/pages.ts`
- Create: `src/content/contracts.ts`
- Create: `tests/content-model.test.ts`
- Modify: `payload.config.ts`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: source fields documented in the migration spec.
- Produces: collection slugs `projects`, `services`, `notes`; global slugs `site-settings`, `site-copy`, `home-page`, `about-page`, `company-page`, `contact-page`, `services-page`, `projects-page`, `notes-page`; `Language = 'en' | 'zh'`.

- [ ] Write tests asserting all collection/global slugs, required `language` and `translationKey` fields, drafts/versions, unique compound route validation, and explicit bilingual groups on page Globals.
- [ ] Run the focused tests and verify the missing model failures.
- [ ] Implement focused collection, global, SEO, FAQ, array, and localized-page field modules.
- [ ] Register all models and generate Payload TypeScript types.
- [ ] Run focused tests and the production build.
- [ ] Update `CHANGELOG.md`, commit with `feat: model bilingual website content`, and push.

### Task 3: Immutable Sanity Migration Snapshot

**Files:**
- Create: `migration/sanity-public-2026-08-25.json`
- Create: `migration/sanity-public-2026-08-25.sha256`
- Create: `scripts/export-sanity.ts`
- Create: `src/migration/source-contract.ts`
- Create: `tests/source-contract.test.ts`
- Modify: `package.json`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: Sanity project `7lstorz2`, dataset `production`, API version `2026-07-13` during explicit export only.
- Produces: `SanitySnapshot { exportedAt, projectId, dataset, siteDocuments, notes }`; `validateSanitySnapshot(value): SanitySnapshot`.

- [ ] Write fixture-contract tests for exactly 39 fixed site documents, required project/service pairs, unique language routes, and complete migrated Note pairs.
- [ ] Run tests and verify failure before the snapshot validator exists.
- [ ] Implement a read-only exporter and strict snapshot validator, excluding Sanity revision metadata and secrets.
- [ ] Export the public dataset once, store a SHA-256 sidecar, and verify the snapshot offline.
- [ ] Re-run tests with network access disabled from the test command.
- [ ] Update `CHANGELOG.md`, commit with `feat: snapshot Sanity migration source`, and push.

### Task 4: Portable Text Conversion and Idempotent Import

**Files:**
- Create: `src/migration/portable-text-to-lexical.ts`
- Create: `src/migration/map-source.ts`
- Create: `src/migration/import-snapshot.ts`
- Create: `scripts/seed.ts`
- Create: `scripts/verify-import.ts`
- Create: `tests/portable-text-to-lexical.test.ts`
- Create: `tests/import-mapping.test.ts`
- Modify: `package.json`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: validated `SanitySnapshot`.
- Produces: `portableTextToLexical(blocks): SerializedEditorState`; `mapSnapshot(snapshot): PayloadSeed`; idempotent `pnpm seed`; offline `pnpm verify:content`.

- [ ] Write converter tests for headings, paragraphs, marks, links, lists, code blocks, and images; write mapping tests for Globals, collection identities, slugs, dates, FAQs, SEO, and source IDs.
- [ ] Run focused tests and verify failures.
- [ ] Implement deterministic Portable Text conversion and source mapping.
- [ ] Implement an idempotent Local API importer using source IDs and explicit `_status: 'published'`.
- [ ] Seed a fresh SQLite database twice and prove the second run creates no duplicates.
- [ ] Run `pnpm verify:content` and compare source/destination counts and stable business fields.
- [ ] Update `CHANGELOG.md`, commit with `feat: import Sanity content into Payload`, and push.

### Task 5: Shared Public Website and Content Queries

**Files:**
- Create: `src/app/(frontend)/layout.tsx`
- Create: `src/app/(frontend)/globals.css`
- Create: `src/components/SiteHeader.tsx`
- Create: `src/components/SiteFooter.tsx`
- Create: `src/components/ThemeControl.tsx`
- Create: `src/components/EditorialArtwork.tsx`
- Create: `src/components/StructuredData.tsx`
- Create: `src/content/loaders.ts`
- Create: `src/content/routes.ts`
- Create: `src/content/view-models.ts`
- Create: `public/images/integrated-work-triptych.webp`
- Create: `public/favicon.svg`
- Create: `tests/routes.test.ts`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: published Payload Globals and Collections.
- Produces: `getSiteContent()`, `getProjects(language)`, `getServices(language)`, `getNotes(language)`, language/alternate URL helpers, and the shared public shell.

- [ ] Write route and loader tests for supported languages, canonical paths, alternate paths, published-only filters, ordering, and missing-record behavior.
- [ ] Run focused tests and verify failures.
- [ ] Port the Astro visual assets and global CSS without redesigning them.
- [ ] Implement server-only Payload loaders and normalized frontend view models.
- [ ] Implement accessible header, navigation, language/theme controls, artwork, footer, and JSON-LD rendering.
- [ ] Run focused tests and build.
- [ ] Update `CHANGELOG.md`, commit with `feat: add Payload-backed public shell`, and push.

### Task 6: Public Pages, Discovery, and Preview

**Files:**
- Create: `src/app/(frontend)/page.tsx`
- Create: `src/app/(frontend)/[lang]/page.tsx`
- Create: `src/app/(frontend)/[lang]/about/page.tsx`
- Create: `src/app/(frontend)/[lang]/company/page.tsx`
- Create: `src/app/(frontend)/[lang]/contact/page.tsx`
- Create: `src/app/(frontend)/[lang]/services/page.tsx`
- Create: `src/app/(frontend)/[lang]/projects/page.tsx`
- Create: `src/app/(frontend)/[lang]/projects/[slug]/page.tsx`
- Create: `src/app/(frontend)/[lang]/notes/page.tsx`
- Create: `src/app/(frontend)/[lang]/notes/[slug]/page.tsx`
- Create: `src/app/(frontend)/robots.ts`
- Create: `src/app/(frontend)/sitemap.ts`
- Create: `src/app/(frontend)/llms.txt/route.ts`
- Create: `src/app/(frontend)/WW_verify_Xs9oqr5SLRAcpl58.txt/route.ts`
- Create: `tests/public-pages.test.ts`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: shared content loaders and view models.
- Produces: all legacy public routes, metadata, Sitemap, robots, `llms.txt`, and the verification token.

- [ ] Write structural tests for all 34 expected pages, canonical/hreflang metadata, no-index exclusions, structured data, and discovery routes.
- [ ] Run focused tests and verify failures.
- [ ] Port each Astro page template into focused React Server Components and generate route metadata.
- [ ] Implement Lexical Note rendering, 404 behavior, and discovery outputs.
- [ ] Run route tests and production build without a Sanity environment variable.
- [ ] Update `CHANGELOG.md`, commit with `feat: migrate bilingual public website`, and push.

### Task 7: End-to-End Verification and Handoff

**Files:**
- Create: `tests/e2e/site.spec.ts`
- Create: `playwright.config.ts`
- Create: `Dockerfile`
- Create: `compose.yaml`
- Create: `scripts/backup.sh`
- Create: `README.md`
- Modify: `package.json`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: complete Payload application and seeded SQLite content.
- Produces: `pnpm verify`, reproducible local startup, persistent deployment volumes, backup script, and browser evidence.

- [ ] Add Playwright checks for `/admin`, Chinese/English home, services, project detail, Note rich text, theme/language controls, images, console errors, and horizontal overflow at desktop and 390px widths.
- [ ] Add production container and compose definitions with persistent database/media volumes and a non-root application process.
- [ ] Add an atomic backup script covering SQLite and media together.
- [ ] Document setup, admin creation, seed, development, verification, backup, restore, and the explicit production-cutover boundary.
- [ ] Run unit tests, type generation, lint/type checks, content verification, production build, browser tests, and container configuration validation.
- [ ] Start the local server, verify public routes and `/admin`, and record the URL.
- [ ] Update `CHANGELOG.md`, commit with `chore: complete Payload migration verification`, and push.
- [ ] Refresh the parent submodule exports and commit only the new submodule registration/reference changes.
