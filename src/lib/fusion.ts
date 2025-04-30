import { AIModel } from 'types/enums'
import { generateQuery } from './chat'
import { embedQuestion, similaritySearch } from './embedding'

/**
 * Implementasi RAG Fusion Search dengan Reciprocal Rank Fusion
 * Menggabungkan hasil dari query asli dan beberapa query ekspansi
 *
 * @param query - Query asli dari pengguna
 * @param collectionName - Nama koleksi di Qdrant
 * @param expansionCount - Jumlah variasi query (default: 3)
 * @param resultsPerQuery - Jumlah hasil per query (default: 8)
 * @param fusionConstant - Konstanta k untuk RRF (default: 60)
 * @returns Array dari dokumen terurut berdasarkan skor fusion
 */
export async function ragFusionSearch({
  query,
  collectionName,
  expansionCount = 3,
  resultsPerQuery = 8,
  fusionConstant = 50,
}: {
  query: string
  collectionName: string
  expansionCount?: number
  resultsPerQuery?: number
  fusionConstant?: number
}) {
  try {
    // 1. Generate query expansions
    const expandedQueriesText = await generateQuery(query, AIModel.MISTRAL_LARGE_LATEST)
    const lines = expandedQueriesText
      .split('\n')
      .filter((line) => line.trim() && !line.match(/^\d+\.?\s*$/) && !line.includes('التنفيذ'))

    // Extract actual queries (remove numbers and extra formatting)
    const expandedQueries = lines
      .map((line) => line.replace(/^\d+\.?\s*/, '').trim())
      .filter((line) => line.length > 0)
      .slice(0, expansionCount)

    // Add original query
    const allQueries = [query, ...expandedQueries]

    // 2. Embed and search for each query
    const searchResults = await Promise.all(
      allQueries.map(async (q) => {
        const embedding = await embedQuestion({ query: q })
        return similaritySearch({
          collectionName,
          query: embedding,
          limit: resultsPerQuery,
        })
      }),
    )

    // 3. Perform Reciprocal Rank Fusion
    const documentScores = new Map<string, number>()

    // Calculate RRF scores
    searchResults.forEach((results) => {
      results.forEach((doc, rank) => {
        const docId = doc.id
        const score = 1 / (rank + fusionConstant)

        if (documentScores.has(docId)) {
          documentScores.set(docId, documentScores.get(docId)! + score)
        } else {
          documentScores.set(docId, score)
        }
      })
    })

    // 4. Collect all unique documents
    const documentMap = new Map()
    searchResults.flat().forEach((doc) => {
      if (!documentMap.has(doc.id)) {
        documentMap.set(doc.id, doc)
      }
    })

    // 5. Sort documents by fusion score
    const fusedResults = Array.from(documentMap.values())
      .map((doc) => ({
        ...doc,
        fusionScore: documentScores.get(doc.id) || 0,
      }))
      .sort((a, b) => b.fusionScore - a.fusionScore)

    return fusedResults
  } catch (error) {
    console.error('Error in RAG Fusion Search:', error)
    throw error
  }
}

/**
 * Mengubah hasil RAG Fusion menjadi teks konteks
 * @param fusionResults - Hasil dari ragFusionSearch
 * @returns String teks konteks yang terformat
 */
export function fusionResultsToContext(fusionResults: any[]): string {
  if (!fusionResults || fusionResults.length === 0) {
    return 'لم يتم العثور على معلومات ذات صلة في قاعدة البيانات.'
  }

  return fusionResults
    .map((result) => {
      const content = result.payload?.content || result.payload?.text || ''
      const title = result.payload?.title ? `## ${result.payload.title}\n\n` : ''
      const source = result.payload?.source ? `**المصدر:** ${result.payload.source}\n\n` : ''
      return `${title}${source}${content}`
    })
    .join('\n\n---\n\n')
}
