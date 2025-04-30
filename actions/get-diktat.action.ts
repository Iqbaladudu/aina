'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

export default async function getDiktatAction() {
  try {
    const diktatList = await payload.find({
      collection: 'diktat',
    })

    return diktatList.docs
  } catch (error) {
    console.error(error)
    return {}
  }
}
