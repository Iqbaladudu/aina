import { embedMany, embed } from 'ai'
import qdrantClient from './qdrant'
import { mistral } from './chat'

// Fungsi ini sudah benar
async function embedQuestion({ query }: { query: string | string[] }) {
  if (Array.isArray(query)) {
    const { embeddings } = await embedMany({
      model: mistral.textEmbeddingModel('mistral-embed'),
      values: query,
    })

    return embeddings
  } else {
    const { embedding } = await embed({
      model: mistral.textEmbeddingModel('mistral-embed'),
      value: query,
    })

    return embedding
  }
}

// Perbaikan untuk fungsi similarity search
async function similaritySearch({
  collectionName,
  query,
  limit = 8,
}: {
  collectionName: string
  query: number[] // Embedding vektor hasil dari embedQuestion
  limit?: number
}) {
  try {
    const searchResult = await qdrantClient.search(collectionName, {
      vector: query,
      limit: limit,
    })

    return searchResult
  } catch (error) {
    console.error('Error during similarity search:', error)
    throw error
  }
}

export { embedQuestion, similaritySearch }
