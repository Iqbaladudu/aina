import { CollectionConfig } from 'payload'
import { isAdminOrSelf } from '../access/isAdmin'

export const Messages: CollectionConfig = {
  slug: 'messages',
  admin: {
    useAsTitle: 'id',
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
      name: 'messageId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'UUID untuk pesan ini',
      },
    },
    {
      name: 'chat',
      type: 'relationship',
      relationTo: 'chats',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Assistant', value: 'assistant' },
        { label: 'System', value: 'system' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'sources',
      type: 'array',
      admin: {
        description: 'Sumber-sumber dari Qdrant yang digunakan dalam jawaban',
      },
      fields: [
        {
          name: 'qdrantId',
          type: 'text',
          required: true,
          admin: {
            description: 'ID dari dokumen di Qdrant',
          },
        },
        {
          name: 'relevanceScore',
          type: 'number',
          min: 0,
          max: 1,
          admin: {
            description: 'Skor relevansi (0-1)',
          },
        },
        {
          name: 'content',
          type: 'textarea',
          admin: {
            description: 'Kutipan dari sumber',
          },
        },
        {
          name: 'pageReference',
          type: 'text',
          admin: {
            description: 'Referensi halaman/bagian diktat',
          },
        },
      ],
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      defaultValue: () => new Date('2025-04-19T07:11:36Z').toISOString(),
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Update lastActivity di chat terkait
        if (req.payload && doc.chat) {
          await req.payload.update({
            collection: 'chats',
            id: typeof doc.chat === 'object' ? doc.chat.id : doc.chat,
            data: {
              lastActivity: new Date('2025-04-19T07:11:36Z').toISOString(),
            },
          })
        }
        return doc
      },
    ],
  },
}
