'use server'

import { generateAnswer } from '@/lib/chat'
import { AIModel } from 'types/enums'

/**
 * Server action untuk menghasilkan jawaban menggunakan RAG Fusion
 *
 * @param query - Pertanyaan pengguna (dalam bahasa Arab)
 * @param collectionName - Nama koleksi Qdrant yang akan digunakan
 * @returns Jawaban berformat text dari AI berdasarkan dokumen yang relevan
 */
export async function getAnswerAction({
  query,
  collectionName = 'fikih-muqoron',
}: {
  query: string
  collectionName?: string
}) {
  try {
    // Validasi input
    if (!query || query.trim() === '') {
      return {
        error: 'Pertanyaan tidak boleh kosong',
        answer: null,
      }
    }

    // Tambahkan logging untuk debugging
    console.log(`Processing question: "${query}" using collection: ${collectionName}`)

    // Generate answer
    const answer = await generateAnswer({
      query,
      collectionName,
    })

    // Return hasil
    return {
      error: null,
      answer,
    }
  } catch (error) {
    console.error('Error generating answer:', error)
    return {
      error: 'Terjadi kesalahan saat menghasilkan jawaban',
      answer: null,
    }
  }
}

export async function getAnswerWithTimeoutAction({
  query,
  collectionName = 'fikih-muqoron',
  modelId = AIModel.MISTRAL_SABA_LATEST,
  timeoutMs = 5000000,
}: {
  query: string
  collectionName?: string
  modelId?: AIModel
  timeoutMs?: number
}) {
  try {
    const answerPromise = generateAnswer({
      query,
      collectionName,
      modelId,
    })
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs),
    )

    const result = (await Promise.race([answerPromise, timeoutPromise])) as any

    return {
      error: null,
      answer: result.answer,
      sources: result.sources,
    }
  } catch (error) {
    console.error('Error generating answer:', error)
    const errorMessage =
      error instanceof Error && error.message === 'Request timeout'
        ? 'Permintaan melebihi batas waktu yang ditentukan'
        : 'Terjadi kesalahan saat menghasilkan jawaban'

    return {
      error: errorMessage,
      answer: null,
      sources: [],
    }
  }
}
