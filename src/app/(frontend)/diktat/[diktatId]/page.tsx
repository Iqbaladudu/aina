'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusIcon, ChatBubbleIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import getDiktatByIdAction from 'actions/get-diktat-by-id.action'
import { useParams } from 'next/navigation'

// Definisi tipe untuk data yang diharapkan dari getDiktatByIdAction
interface DiktatData {
  id: string
  title: string
  description?: string
  // Tambahkan properti lain sesuai kebutuhan
}

interface ChatHistoryItem {
  id: string
  title: string
  lastMessage: string
  date: string
}

const DiktatPage = () => {
  const { diktatId } = useParams<{ diktatId: string }>()

  // Fetch diktat data menggunakan React Query
  const {
    data: diktat,
    isLoading,
    isError,
    error,
  } = useQuery<DiktatData, Error>({
    queryKey: ['diktat', diktatId],
    queryFn: async () => {
      const response = await getDiktatByIdAction(diktatId)

      // Jika diktat tidak ditemukan, throw error untuk ditangani oleh React Query
      if (!response || !response.id) {
        throw new Error('Diktat tidak ditemukan')
      }

      return response
    },
  })

  // Generate dummy chat history berdasarkan diktat title
  const chatHistory: ChatHistoryItem[] = React.useMemo(() => {
    if (!diktat?.title) return []

    return Array.from({ length: 3 }, (_, i) => ({
      id: `chat_2025041${9 - i}${i}`,
      title: `Diskusi tentang ${diktat.title} (${i + 1})`,
      lastMessage: 'Bagaimana perbedaan pendapat terkait masalah ini?',
      date: `2025-04-1${9 - i}`,
    }))
  }, [diktat?.title])

  // Tampilkan loading state
  if (isLoading) {
    return (
      <div className="container max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto py-6 px-2 sm:px-4">
        <div className="mb-8">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-12 w-full sm:w-52" />
        </div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  // Tampilkan error state
  if (isError) {
    return (
      <div className="container max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto py-6 px-2 sm:px-4">
        <Alert variant="destructive" className="mb-6">
          <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'Gagal memuat data diktat. Silakan coba lagi nanti.'}
          </AlertDescription>
        </Alert>

        <Button asChild className="mt-4 w-full sm:w-auto">
          <Link href="/diktat">Kembali ke Daftar Diktat</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto py-6 px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{diktat.title}</h1>
          {diktat.description && <p className="text-gray-600 mt-2">{diktat.description}</p>}
        </div>
        <Button
          asChild
          className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105"
        >
          <Link href={`/diktat/${diktatId}/chat/new`}>
            <PlusIcon className="mr-2 h-5 w-5" /> Mulai Chat Baru
          </Link>
        </Button>
      </div>

      {/* Chat History Section */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Riwayat Chat</h2>

        {chatHistory.length > 0 ? (
          <div
            className="
              grid gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {chatHistory.map((chat) => (
              <Link
                key={chat.id}
                href={`/diktat/${diktatId}/chat/${chat.id}`}
                className="
                  group
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary
                  rounded-xl
                  transition
                  duration-300
                  hover:scale-[1.03]
                  active:scale-100
                "
                tabIndex={0}
              >
                <Card
                  className="
                    h-full
                    bg-white
                    border
                    border-gray-100
                    shadow-sm
                    rounded-xl
                    transition-colors
                    group-hover:bg-accent
                    group-hover:border-primary
                    group-active:bg-accent/80
                  "
                >
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <ChatBubbleIcon className="text-primary w-5 h-5 flex-shrink-0" />
                    <CardTitle className="text-base sm:text-lg font-medium truncate">
                      {chat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600 line-clamp-2">{chat.lastMessage}</p>
                    <span className="text-xs text-gray-400 mt-2">{chat.date}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-gray-50 rounded-lg text-gray-500">
            Belum ada riwayat chat untuk diktat ini. Mulai chat baru untuk mendiskusikan{' '}
            {diktat.title}.
          </div>
        )}
      </section>
    </div>
  )
}

export default DiktatPage
