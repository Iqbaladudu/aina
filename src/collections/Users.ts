import { NextResponse } from 'next/server'
import { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  auth: true,
  admin: {
    useAsTitle: 'username',
  },
  access: {
    create: () => true,
  },
  fields: [
    {
      name: 'fullname',
      label: 'Nama Lengkap',
      type: 'text',
      required: true,
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'phone',
      label: 'Nomor Telepon/WhatsApp',
      type: 'text',
      unique: true,
    },
  ],
}

export default Users
