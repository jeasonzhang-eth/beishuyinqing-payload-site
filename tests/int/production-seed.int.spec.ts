import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

import { expect, it } from 'vitest'

it('seeds a fresh production database through registered migrations', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'multiple-engine-production-seed-'))
  const databasePath = path.join(directory, 'payload.db')

  try {
    const result = spawnSync('pnpm', ['exec', 'tsx', 'scripts/seed.ts'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: {
        ...process.env,
        DATABASE_URL: `file:${databasePath}`,
        NEXT_PUBLIC_SERVER_URL: 'https://beishuyinqing.cn',
        NODE_ENV: 'production',
        PAYLOAD_SECRET: 'production-seed-test-secret-at-least-32-characters',
      },
    })

    expect(result.stderr).toBe('')
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('"projects": 12')
    expect(result.stdout).toContain('"services": 10')
    expect(result.stdout).toContain('"notes": 8')
  } finally {
    rmSync(directory, { force: true, recursive: true })
  }
}, 60_000)
