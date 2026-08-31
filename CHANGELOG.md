# Changelog

## 2026-09-01

- Rebuilt the public frontend around the official Multiple Engine brand system, including authoritative logo assets, a restrained graphite, blue, and teal interface, branded metadata, favicon, and social sharing artwork.
- Reframed the homepage and service directory around the four approved capabilities, with infrastructure presented as a delivery foundation rather than a fifth product line.
- Added an accessible responsive navigation, branded dark mode, and browser coverage for the homepage, content detail pages, discovery files, and every primary directory route.
- Kept nested migration worktrees out of lint traversal so repository checks cover authored source without scanning generated Next.js output.

## 2026-08-31

- Restored the local worktree ignore rule so the primary submodule checkout stays clean while migration worktrees remain available.
- Made Payload configuration load the repository environment file directly so local Next.js and Turbopack startup cannot initialize Payload before `PAYLOAD_SECRET` is available.
- Hardened Compose deployment with required production variables, loopback-only exposure, stable persistent volumes, a pinned package manager, and an idempotent one-shot content seeder for fresh servers.
- Restricted user and media mutations to authenticated administrators before exposing the Payload API in production.
- Added and registered the initial Payload SQLite migration so a fresh production database is created before content seeding.

## 2026-08-25

- Created the Payload 3.88 and Next.js 16 application foundation with SQLite, authenticated administrators, image uploads, generated types, integration tests, and production build support.
- Added versioned bilingual Globals and routed Project, Service, and Note Collections with deterministic route and translation identities.
- Added a strict, checksummed public Sanity snapshot export so migration and future builds can run without a live Sanity dependency.
- Added deterministic Portable Text to Lexical conversion plus an idempotent Payload importer and source-ID content verification.
- Migrated the bilingual public website to Payload-backed Next.js routes with the existing visual identity, responsive artwork, metadata, structured data, Sitemap, robots, and llms.txt discovery output.
- Added production container persistence, atomic SQLite and media backups, local and deployment documentation, and browser verification for the public site and Payload Admin.
