import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [{ label: 'Administrator', value: 'admin' }],
      saveToJWT: true,
    },
  ],
}
