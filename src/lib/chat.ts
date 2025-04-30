import { createMistral } from '@ai-sdk/mistral'
import { createXai } from '@ai-sdk/xai'
import { generateText } from 'ai'
import { createIslamicScholarPrompt, createQueryExpansionPrompt } from './prompts'
import { fusionResultsToContext, ragFusionSearch } from './fusion'
import { AIModel } from 'types/enums'
import { createQwen } from 'qwen-ai-provider'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})
export const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
})

export const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
})

export const qwen = createQwen({
  baseURL: process.env.QWEN_URL,
  apiKey: process.env.QWEN_API_KEY,
})

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

// Registry untuk model providers
// Mendefinisikan mapping antara AIModel enum dan provider/model yang sebenarnya
export const modelProviders = {
  [AIModel.MISTRAL_SABA_LATEST]: {
    provider: mistral,
    modelId: 'mistral-saba-latest',
    name: 'Mistral Saba',
  },
  [AIModel.MISTRAL_LARGE_LATEST]: {
    provider: mistral,
    modelId: 'mistral-large-latest',
    name: 'Mistral Large',
  },
  [AIModel.GROK_3]: {
    provider: xai,
    modelId: 'grok-3',
    name: 'Grok 3',
  },
  [AIModel.GROK_3_MINI]: {
    provider: xai,
    modelId: 'grok-3-mini',
    name: 'Grok 3 Mini',
  },
  [AIModel.CLAUDE_3_OPUS_LATEST]: {
    provider: anthropic,
    modelId: 'claude-3-opus-latest',
    name: 'Claude 3 Opus',
  },
}

// Helper untuk mendapatkan provider configuration
function getModelConfig(modelId: AIModel) {
  return modelProviders[modelId] || modelProviders[AIModel.MISTRAL_SABA_LATEST]
}

/**
 * Menghasilkan variasi query menggunakan model yang dipilih
 */
export async function generateQuery(query: string, modelId: AIModel = AIModel.MISTRAL_SABA_LATEST) {
  const modelConfig = getModelConfig(modelId)
  console.log(`Generating query variations using ${modelConfig.name}`)

  const response = await generateText({
    model: mistral('mistral-large-latest'),
    prompt: createQueryExpansionPrompt({ query, numVariations: 3 }),
    temperature: 0.7,
  })

  return response.text
}

/**
 * Menghasilkan jawaban menggunakan RAG dengan model yang dipilih
 */
export async function generateAnswer({
  query,
  collectionName,
  modelId = AIModel.MISTRAL_SABA_LATEST,
}: {
  query: string
  collectionName: string
  modelId?: AIModel
}) {
  console.log(`Generating answer with model: ${modelId} for collection: ${collectionName}`)

  // Get related documents
  const fusionResults = await ragFusionSearch({ query, collectionName })
  const contextText = fusionResultsToContext(fusionResults)

  // Get model configuration
  const modelConfig = getModelConfig(modelId)
  console.log(`Using model ${modelConfig.name} (${modelConfig.modelId})`)

  try {
    // Generate text with selected model
    const { text } = await generateText({
      model: modelConfig.provider(modelConfig.modelId),
      prompt: createIslamicScholarPrompt({ context: contextText, question: query }),
      temperature: 0.1,
      maxTokens: modelConfig.modelId === AIModel.CLAUDE_3_OPUS_LATEST ? 4096 : 100000,
    })

    // Extract and format sources for display
    const sources = fusionResults.slice(0, 5).map((result) => ({
      id: result.id,
      score: result.fusionScore || result.score,
      title: result.payload?.title || 'Untitled',
      source: result.payload?.source || '',
      pageReference: result.payload?.metadata?.page_label || result.payload?.page || '',
      content: result.payload?.content?.substring(0, 150) || '',
    }))

    return {
      answer: text,
      sources,
    }
  } catch (error) {
    console.error('Error generating answer:', error)
    throw error
  }
}
