import { CollectionConfig } from 'payload'
import { isAdminOrSelf } from '../access/isAdmin'

export const Chats: CollectionConfig = {
  slug: 'chats',
  admin: {
    useAsTitle: 'title',
    group: 'Interactions',
  },
  access: {
    read: isAdminOrSelf,
    create: ({ req: { user } }) => Boolean(user),
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
  },
  fields: [
    {
      name: 'chatId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'UUID untuk chat ini',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'diktat',
      type: 'relationship',
      relationTo: 'diktat',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Apakah chat ini masih aktif',
      },
    },
    {
      name: 'lastActivity',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'Ringkasan otomatis dari percakapan',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        return {
          ...data,
          lastActivity: new Date('2025-04-19T07:11:36Z').toISOString(),
        }
      },
    ],
  },
}
