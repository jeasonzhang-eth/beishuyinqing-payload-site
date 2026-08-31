import 'dotenv/config'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Notes } from './collections/Notes'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import {
  AboutPage,
  CompanyPage,
  ContactPage,
  HomePage,
  NotesPage,
  ProjectsPage,
  ServicesPage,
} from './globals/pages'
import { SiteCopy } from './globals/SiteCopy'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' - Multiple Engine CMS',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Projects, Services, Notes],
  globals: [
    SiteSettings,
    SiteCopy,
    HomePage,
    AboutPage,
    CompanyPage,
    ContactPage,
    ServicesPage,
    ProjectsPage,
    NotesPage,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
    prodMigrations: migrations,
  }),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  sharp,
  plugins: [],
})
