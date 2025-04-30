'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PaperPlaneIcon, GearIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import getDiktatByIdAction from 'actions/get-diktat-by-id.action'
import { getAnswerWithTimeoutAction } from 'actions/get-answer.action'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { ModelSelector } from '@/components/ModelSelector'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle } from 'lucide-react'
import { AIModel } from 'types/enums'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'

interface ChatPageProps {
  params: {
    diktatId: string
    chatId: string
  }
}

// Tipe untuk data diktat dari API
interface DiktatData {
  id: string
  title: string
  collection_name?: string
  icon?: string
  description?: string
}

// Tipe untuk sumber rujukan
interface Source {
  id: string
  score?: number
  title: string
  source?: string
  pageReference?: string
  content?: string
}

// Tipe untuk pesan chat
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  sources?: Source[]
}

// Konstanta aplikasi
const CURRENT_USER = 'USER'
const DEFAULT_COLLECTION = 'fikih-muqoron'

export default function ChatPage({ params }: ChatPageProps) {
  const { diktatId, chatId } = params
  const router = useRouter()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [diktatTitle, setDiktatTitle] = useState('')
  const [diktatIcon, setDiktatIcon] = useState('📚')
  const [collectionName, setCollectionName] = useState<string>(DEFAULT_COLLECTION)
  const { isMobile } = useSidebar()

  // State untuk model dan pengaturan
  const [selectedModel, setSelectedModel] = useState<AIModel>(AIModel.MISTAL_SABA_LATEST)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Fetch diktat data menggunakan React Query
  const {
    data: diktat,
    isLoading: isDiktatLoading,
    isError: isDiktatError,
    error: diktatError,
  } = useQuery<DiktatData>({
    queryKey: ['diktat', diktatId],
    queryFn: async () => {
      try {
        const response = await getDiktatByIdAction(diktatId)
        return response
      } catch (error) {
        console.error('Error fetching diktat:', error)
        throw error
      }
    },
  })

  // Update diktat title dan collectionName saat data diktat berhasil dimuat
  useEffect(() => {
    if (diktat) {
      setDiktatTitle(diktat.title || 'Diktat')
      if (diktat.icon) setDiktatIcon(diktat.icon)
      if (diktat.collection_name) {
        setCollectionName(diktat.collection_name)
      }
    }
  }, [diktat])

  // Handle navigasi ke halaman chat baru jika chatId adalah "new"
  useEffect(() => {
    if (chatId === 'new') {
      // Generate UUID untuk chat baru
      const uuid = self.crypto.randomUUID()
      router.replace(`/diktat/${diktatId}/chat/${uuid}`)
    } else {
      // Load chat history untuk chat yang sudah ada
      const currentTime = new Date().toISOString()
      setMessages([
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Saya dapat membantu Anda memahami materi dalam diktat ${diktatTitle || 'ini'} menggunakan data yang terintegrasi. Apa yang ingin Anda tanyakan?`,
          timestamp: currentTime,
        },
      ])
    }
  }, [diktatId, chatId, router, diktatTitle])

  // Scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-focus textarea saat halaman dimuat
  useEffect(() => {
    if (!isDiktatLoading && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isDiktatLoading])

  // Handle submit pesan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const currentTime = new Date().toISOString()

    // Tambahkan pesan user ke state
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: currentTime,
    }

    // Simpan pertanyaan user untuk digunakan dalam AI response
    const userQuestion = input.trim()

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Panggil API RAG untuk mendapatkan jawaban
      const result = await getAnswerWithTimeoutAction({
        query: userQuestion,
        collectionName,
        modelId: selectedModel,
        timeoutMs: 60000, // 60 detik timeout
      })

      if (result.error) {
        // Tampilkan error sebagai pesan chat
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Maaf, terjadi kesalahan: ${result.error}. Silakan coba lagi.`,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, errorMessage])

        toast.error('Error', {
          description: result.error,
        })
      } else {
        // Tambahkan jawaban AI ke chat
        const aiResponse: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            result.answer ||
            `Maaf, saya tidak dapat menemukan jawaban untuk pertanyaan Anda tentang ${diktatTitle || 'diktat ini'}.`,
          timestamp: new Date().toISOString(),
          sources: result.sources,
        }
        setMessages((prev) => [...prev, aiResponse])
      }
    } catch (error) {
      console.error('Error saat memproses pesan:', error)

      // Tambahkan pesan error ke chat
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi.`,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        formRef.current?.requestSubmit()
      }
    }
  }

  // Renderkan placeholder jika diktat loading
  if (isDiktatLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex justify-between items-center px-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </div>
        <div className="border-t p-4 bg-background">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Skeleton className="h-16 flex-1" />
            <Skeleton className="h-16 w-16" />
          </div>
        </div>
      </div>
    )
  }

  // Renderkan error jika diktat tidak ditemukan
  if (isDiktatError) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex justify-between items-center px-4">
            <h1 className="text-xl font-semibold text-destructive">Error</h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto mt-12 p-6 border border-destructive/30 bg-destructive/5 rounded-lg text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-bold mb-2">Diktat Tidak Ditemukan</h2>
            <p className="mb-4 text-muted-foreground">
              {(diktatError as Error)?.message || 'Tidak dapat menemukan diktat yang diminta.'}
            </p>
            <Button onClick={() => router.push('/diktat')}>Kembali ke Daftar Diktat</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className={`border-b p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 ${isMobile && 'flex flex-row items-center justify-center'}`}
      >
        {isMobile && <SidebarTrigger />}
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{diktatIcon}</span>
            <h1 className="text-lg md:text-xl font-semibold">{diktatTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground hidden md:block">
              Chat ID: {chatId.substring(0, 8)}...
            </div>
          </div>
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              title="Pengaturan Model AI"
            >
              <GearIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            title="Pengaturan Model AI"
          >
            <GearIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dialog Pengaturan */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pengaturan Model AI</DialogTitle>
            <DialogDescription>
              Pilih model AI yang akan digunakan untuk menjawab pertanyaan Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Model AI</label>
              <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                Model yang dipilih akan digunakan untuk menjawab pertanyaan berikutnya.
              </p>
              <p>
                <strong>Catatan:</strong> Model yang berbeda mungkin memberikan jawaban dengan gaya
                dan kedalaman yang berbeda.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  'max-w-[85%] rounded-lg p-4',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'bg-muted rounded-tl-none',
                )}
              >
                {message.role === 'assistant' ? (
                  <div
                    className={cn(
                      'prose prose-sm dark:prose-invert max-w-none',
                      message.role === 'user'
                        ? 'prose-p:text-primary-foreground prose-headings:text-primary-foreground prose-strong:text-primary-foreground'
                        : '',
                    )}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1 className="text-xl font-bold my-4" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-lg font-bold my-3" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-md font-bold my-2" {...props} />
                        ),
                        a: ({ node, ...props }) => (
                          <a className="text-blue-500 hover:underline" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc pl-5 my-2" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal pl-5 my-2" {...props} />
                        ),
                        li: ({ node, ...props }) => <li className="my-1" {...props} />,
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            className="border-l-4 border-gray-300 pl-4 italic my-2"
                            {...props}
                          />
                        ),
                        pre: ({ node, ...props }) => (
                          <pre
                            className="bg-gray-800 text-gray-100 p-2 rounded my-2 overflow-x-auto"
                            {...props}
                          />
                        ),
                        code: ({ node, inline, ...props }) =>
                          inline ? (
                            <code
                              className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm"
                              {...props}
                            />
                          ) : (
                            <code {...props} />
                          ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>

                    {/* Menampilkan sumber rujukan */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <details className="text-sm">
                          <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            Sumber Rujukan ({message.sources.length})
                          </summary>
                          <div className="mt-2 space-y-2">
                            {message.sources.map((source) => (
                              <div key={source.id} className="p-2 bg-background/60 rounded-md">
                                <div className="font-medium">{source.title}</div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {source.pageReference && (
                                    <div className="text-xs px-2 py-1 bg-primary/10 rounded-full text-primary">
                                      Halaman: {source.pageReference}
                                    </div>
                                  )}
                                  {source.source && (
                                    <div className="text-xs px-2 py-1 bg-secondary/10 rounded-full text-secondary-foreground">
                                      {source.source}
                                    </div>
                                  )}
                                </div>
                                {source.content && (
                                  <div className="mt-2 text-xs text-muted-foreground border-l-2 border-muted pl-2 italic">
                                    "{source.content}..."
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:text-primary-foreground">
                    {message.content}
                  </div>
                )}
                <div className="text-xs mt-2 opacity-70 flex justify-between items-center">
                  <span>{message.role === 'user' ? CURRENT_USER : 'AI'}</span>
                  <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              {message.role === 'user' && (
                <Avatar className="h-8 w-8 ml-2 mt-1">
                  <AvatarFallback>{CURRENT_USER.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <Avatar className="h-8 w-8 mr-2 mt-1">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[85%] rounded-lg p-4 bg-muted rounded-tl-none">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Menggunakan model {selectedModel}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="border-t p-4 bg-background sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto">
          {/* Tampilkan model yang digunakan */}
          <div className="flex justify-between items-center mb-2 px-1">
            <div className="text-xs text-muted-foreground">Model: {selectedModel}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              className="h-7 px-2 text-xs"
            >
              <GearIcon className="h-3 w-3 mr-1" /> Ganti Model
            </Button>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Tanyakan tentang ${diktatTitle || 'diktat ini'}...`}
              className="min-h-[60px] flex-1 resize-none"
              disabled={isLoading}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              className="h-[60px] w-[60px]"
              disabled={isLoading || !input.trim()}
            >
              <PaperPlaneIcon className="h-5 w-5" />
            </Button>
          </form>
          <div className="text-xs text-center text-muted-foreground mt-2">
            Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
          </div>
        </div>
      </div>
    </div>
  )
}
