import { describe, expect, it } from 'vitest'

import { Media } from '@/collections/Media'
import { Users } from '@/collections/Users'

describe('Payload foundation', () => {
  it('registers authenticated administrators', () => {
    expect(Users.slug).toBe('users')
    expect(Users.auth).toBe(true)
    expect(Users.access).toEqual(
      expect.objectContaining({
        create: expect.any(Function),
        delete: expect.any(Function),
        read: expect.any(Function),
        update: expect.any(Function),
      }),
    )
    expect(Users.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'role', required: true, saveToJWT: true }),
      ]),
    )
  })

  it('registers public image uploads with required alt text', () => {
    expect(Media.slug).toBe('media')
    expect(Media.upload).toEqual(
      expect.objectContaining({ mimeTypes: ['image/*'], staticDir: 'media' }),
    )
    expect(Media.access).toEqual(
      expect.objectContaining({
        create: expect.any(Function),
        delete: expect.any(Function),
        read: expect.any(Function),
        update: expect.any(Function),
      }),
    )
    expect(Media.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'alt', required: true })]),
    )
  })
})
