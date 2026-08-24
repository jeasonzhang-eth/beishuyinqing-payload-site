import { describe, expect, it } from 'vitest'

import { Media } from '@/collections/Media'
import { Users } from '@/collections/Users'

describe('Payload foundation', () => {
  it('registers authenticated administrators', () => {
    expect(Users.slug).toBe('users')
    expect(Users.auth).toBe(true)
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
    expect(Media.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'alt', required: true })]),
    )
  })
})
