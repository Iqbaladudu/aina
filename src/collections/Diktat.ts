import { isAdmin } from '@/access/isAdmin'
import { CollectionConfig } from 'payload'

export const Diktat: CollectionConfig = {
  slug: 'diktat',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'ID unik untuk diktat ini, contoh: fikih-muqoron',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'icon',
      type: 'text',
      defaultValue: '📚',
      admin: {
        description: 'Emoji atau ikon yang mewakili diktat ini',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      type: 'text',
      admin: {
        description: 'Penulis atau penyusun diktat',
      },
    },
    {
      name: 'year',
      type: 'number',
      admin: {
        description: 'Tahun penerbitan',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'published',
      required: true,
    },
    {
      name: 'qdrantCollection',
      type: 'text',
      required: true,
      admin: {
        description: 'Nama koleksi di Qdrant Cloud tempat embedding disimpan',
      },
    },
    {
      name: 'chunkCount',
      type: 'number',
      admin: {
        description: 'Jumlah chunk teks yang diembed di Qdrant',
        readOnly: true,
      },
    },
    {
      name: 'metaData',
      type: 'json',
      admin: {
        description: 'Metadata tambahan tentang diktat dan embedding-nya',
      },
    },
  ],
}
