'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import getDiktatAction from 'actions/get-diktat.action'

// Data diktat yang sama dengan di layout
// const diktatList = [
//   {
//     id: 'fikih-muqoron',
//     title: 'Fikih Muqoron',
//     description: 'Studi perbandingan mazhab fikih',
//     icon: '📚',
//   },
//   {
//     id: 'ushul-fikih',
//     title: 'Ushul Fikih',
//     description: 'Metodologi hukum Islam',
//     icon: '📝',
//   },
//   {
//     id: 'hadits-ahkam',
//     title: 'Hadits Ahkam',
//     description: 'Hadits-hadits tentang hukum Islam',
//     icon: '🔍',
//   },
//   {
//     id: 'tafsir-ahkam',
//     title: 'Tafsir Ahkam',
//     description: 'Tafsir ayat-ayat hukum',
//     icon: '📖',
//   },
//   {
//     id: 'qowaid-fikih',
//     title: 'Qowaid Fikih',
//     description: 'Kaidah-kaidah fikih',
//     icon: '⚖️',
//   },
// ]

// Konstanta aplikasi - menggunakan data user & waktu dari input
const CURRENT_USER = 'Iqbaladudu'
const CURRENT_DATETIME = '2025-04-19T06:53:01Z'

export default function NewChatPage() {
  const router = useRouter()
  const [selectedDiktat, setSelectedDiktat] = useState<string | null>(null)

  const diktatList = useQuery({
    queryKey: ['diktatList'],
    queryFn: async () => {
      const response = await getDiktatAction()
      return response
    },
  })

  const handleStartChat = () => {
    if (!selectedDiktat) return

    // Generate UUID untuk chat baru
    const uuid = self.crypto.randomUUID()

    // Redirect ke chat baru dengan diktat yang dipilih
    router.push(`/diktat/${selectedDiktat}/chat/${uuid}`)
  }

  return (
    <div className="container mx-auto max-w-5xl py-10">
      <h1 className="text-3xl font-bold mb-8">Mulai Chat Baru</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Pilih Diktat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diktatList.isSuccess &&
            diktatList.data?.map((diktat) => (
              <Card
                key={diktat.id}
                className={`cursor-pointer transition-all ${
                  selectedDiktat === diktat.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedDiktat(diktat.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{diktat.icon}</span>
                    <CardTitle>{diktat.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription></CardDescription>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={selectedDiktat === diktat.id ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedDiktat(diktat.id)
                      handleStartChat()
                    }}
                  >
                    {selectedDiktat === diktat.id ? 'Diktat Terpilih' : 'Pilih Diktat Ini'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        {/* <div className="text-sm text-muted-foreground">
          User: {CURRENT_USER} • {new Date(CURRENT_DATETIME).toLocaleString()}
        </div> */}
        <Button size="lg" onClick={handleStartChat} disabled={!selectedDiktat}>
          Mulai Chat
        </Button>
      </div>
    </div>
  )
}
