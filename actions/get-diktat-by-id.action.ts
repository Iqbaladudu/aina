'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

// Ambil satu diktat berdasarkan ID
export default async function getDiktatByIdAction(id: string) {
  try {
    const diktat = await payload.findByID({
      collection: 'diktat',
      id,
    })

    return diktat
  } catch (error) {
    console.error(error)
    return null
  }
}
