import type { Access, GlobalConfig } from 'payload'

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const publishedOrAuthenticated: Access = ({ req }) =>
  req.user
    ? true
    : {
        _status: {
          equals: 'published',
        },
      }

export const globalAccess: GlobalConfig['access'] = {
  read: () => true,
  update: ({ req }) => Boolean(req.user),
}
