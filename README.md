# Multiple Engine website

The official website for Multiple Engine, built as one Payload CMS 3 and Next.js 16 application. Payload owns the editor, content API, media, and public React frontend; Sanity is only the historical migration source and is not a runtime dependency.

## What runs here

- Public website: `/zh/`, `/en/`, and their page/detail routes
- Payload Admin: `/admin/`
- Payload REST and GraphQL APIs: `/api/`
- Discovery: `/robots.txt`, `/sitemap.xml`, and `/llms.txt`
- Storage: SQLite in `data/` and uploaded files in `media/`

This repository does not contain or serve the AiYiSou website.

## Local setup

Requirements: Node.js 20.9 or newer, pnpm 9 or newer, and SQLite 3 for backups.

```bash
cp .env.example .env
pnpm install --frozen-lockfile
pnpm seed
pnpm dev
```

Generate independent secrets before using the application outside local development:

```bash
openssl rand -hex 32
```

Set the output as `PAYLOAD_SECRET` and set `NEXT_PUBLIC_SERVER_URL` to the public origin. The local URLs are:

- Website: `http://localhost:3000/zh/`
- Admin: `http://localhost:3000/admin/`

On a fresh database, open `/admin/` to create the first administrator. `pnpm seed` can be run before or after this step; it imports only website content and is idempotent.

## Content migration

The checked-in migration input is `migration/sanity-public-2026-08-25.json`, with its SHA-256 sidecar. Normal development and builds never contact Sanity.

```bash
pnpm content:snapshot:verify
pnpm seed
pnpm verify:content
```

The expected imported collection counts are 12 project translations, 10 service translations, and 8 Note translations. Re-running `pnpm seed` updates those 30 records by stable source ID instead of duplicating them.

## Verification

Run the offline content, integration, lint, and production-build checks:

```bash
pnpm verify
```

Run browser checks against a development server:

```bash
pnpm dev
pnpm verify:e2e
```

Use `PLAYWRIGHT_BASE_URL=http://localhost:3117 pnpm verify:e2e` when the site is already running on another port.

## Container deployment

Create `.env`, set `NEXT_PUBLIC_SERVER_URL` to the production HTTPS origin, and then run:

```bash
mkdir -p backups
docker compose --profile maintenance run --rm --build seed
docker compose up -d --build site
docker compose ps
```

The one-shot `seed` service imports the checked-in Sanity snapshot and fixes persistent-volume ownership before the non-root site process starts. It is idempotent and can be run again to update migrated records. `compose.yaml` binds the application only to `127.0.0.1`; place Nginx or another authenticated reverse proxy in front of it.

The Compose project has a stable name, so its SQLite and media volumes survive source release-directory changes. Do not scale this SQLite service beyond one application instance; migrate to PostgreSQL before horizontal scaling.

## Backup and restore

For a local process, run:

```bash
./scripts/backup.sh
```

For Compose, the container includes SQLite and the backup script:

```bash
docker compose exec -u 0 site env \
  PAYLOAD_DATA_DIR=/app/data \
  PAYLOAD_MEDIA_DIR=/app/media \
  PAYLOAD_BACKUP_DIR=/app/backups \
  /app/scripts/backup.sh
```

Each completed backup directory contains an SQLite online backup, `media.tar.gz`, and `SHA256SUMS`. The directory is renamed into place only after all three files are ready.

Restore into a stopped application:

1. Verify the backup with `sha256sum -c SHA256SUMS`.
2. Stop the site process or run `docker compose stop site`.
3. Replace the persistent `payload.db` with the backed-up database.
4. Clear the persistent media directory and extract `media.tar.gz` into it.
5. Restore ownership for the application user, start the site, and run `pnpm verify:content` or check the equivalent routes in the container.

Database and media belong to the same restore point and must be restored together.

## Production boundary

The current production Astro release is intentionally untouched. DNS, Nginx, Cloudflare, and the active process should switch only after this application is deployed separately, seeded, backed up, and checked through its public hostname. Keep the previous release available for immediate rollback during cutover.

Architecture and migration details live in `docs/superpowers/specs/2026-08-25-payload-nextjs-migration-design.md`.
