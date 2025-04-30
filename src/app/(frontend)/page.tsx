'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowRightIcon,
  StarIcon,
  ChatBubbleIcon,
  LightningBoltIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons'
import { BookOpenIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Konstanta aplikasi
const CURRENT_USER = 'Iqbaladudu'
const CURRENT_DATETIME = '2025-04-19T06:57:51Z'

// Data diktat featured
const featuredDiktats = [
  {
    id: 'fikih-muqoron',
    title: 'Fikih Muqoron',
    description: 'Studi perbandingan mazhab fikih dalam Islam',
    icon: '📚',
    color: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-50',
    delay: 0.1,
  },
  {
    id: '#',
    title: 'Ushul Fikih',
    description: 'Metodologi penetapan hukum dalam syariat Islam',
    icon: '📝',
    color: 'from-emerald-500 to-green-600',
    textColor: 'text-emerald-50',
    delay: 0.2,
  },
  {
    id: '#',
    title: 'Hadits Ahkam',
    description: 'Hadits-hadits yang berkaitan dengan hukum Islam',
    icon: '🔍',
    color: 'from-amber-500 to-orange-600',
    textColor: 'text-amber-50',
    delay: 0.3,
  },
]

// Fitur aplikasi
const features = [
  {
    icon: <ChatBubbleIcon className="h-10 w-10" />,
    title: 'Chat Interaktif',
    description: 'Diskusikan materi diktat dengan AI yang memahami konteks dari sumber rujukan',
    delay: 0.2,
  },
  {
    icon: <MagnifyingGlassIcon className="h-10 w-10" />,
    title: 'Pencarian Intelijen',
    description:
      'Temukan jawaban di seluruh diktat dengan teknologi RAG (Retrieval-Augmented Generation)',
    delay: 0.3,
  },
  {
    icon: <LightningBoltIcon className="h-10 w-10" />,
    title: 'Belajar Efisien',
    description:
      'Dapatkan penjelasan dan ringkasan materi kompleks dalam bahasa yang mudah dipahami',
    delay: 0.4,
  },
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [hoveredDiktat, setHoveredDiktat] = useState<string | null>(null)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl"
            initial={{ x: -100, opacity: 0.2 }}
            animate={{
              x: [0, 20, 0],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-secondary/5 rounded-full blur-3xl"
            initial={{ y: 100, opacity: 0.2 }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 2,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 relative z-10">
            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Belajar Materi Perkuliahan bersama <span className="text-primary">AI</span>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Diskusikan dan pelajari materi kuliah dengan AI yang memahami diktat perkuliahan kamu
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button size="lg" asChild>
                <Link href="/chat/new">
                  Mulai Chat <ArrowRightIcon className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#diktat">
                  Jelajahi Diktat <BookOpenIcon className="ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Animasi visual */}
          <motion.div
            className="mt-16 relative h-64 md:h-96 mx-auto max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-white/5 border border-border backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="ml-4 text-sm font-medium text-muted-foreground">
                    Chat dengan Fikih Muqoron
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-6">
                <motion.div
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {CURRENT_USER.charAt(0)}
                  </div>
                  <div className="flex-1 p-4 rounded-lg bg-primary text-primary-foreground">
                    <p>ما الفرق بين المذهب الشافعي والمذهب الحنفي في مسألة الصلاة؟</p>
                    <p className="text-xs mt-2 opacity-80">
                      (Apa perbedaan antara mazhab Syafi'i dan Hanafi dalam masalah shalat?)
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    AI
                  </div>
                  <div className="flex-1 p-4 rounded-lg bg-muted">
                    <p>
                      الفرق بين المذهب الشافعي والمذهب الحنفي في مسألة الصلاة يشمل عدة جوانب مهمة:
                    </p>
                    <p className="text-xs mt-1 mb-2 opacity-80">
                      (Perbedaan antara mazhab Syafi'i dan Hanafi dalam masalah shalat mencakup
                      beberapa aspek penting:)
                    </p>
                    <motion.ul
                      className="ml-4 mt-2 space-y-1 list-disc"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5, staggerChildren: 0.2 }}
                    >
                      <motion.li
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.7 }}
                      >
                        <strong>النية (Niat):</strong> المذهب الشافعي يوجب النية عند تكبيرة الإحرام،
                        بينما المذهب الحنفي يجيز النية قبل التكبير
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.9 }}
                      >
                        <strong>قراءة الفاتحة (Bacaan Fatihah):</strong> الشافعي يوجبها في كل ركعة،
                        والحنفي لا يوجبها على المأموم
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.1 }}
                      >
                        <strong>القنوت (Qunut):</strong> الشافعي يسن القنوت في صلاة الصبح...
                      </motion.li>
                    </motion.ul>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-6 left-0 right-0 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ delay: 2.5, duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <div className="px-4 py-2 rounded-full bg-background text-xs text-muted-foreground border shadow-sm flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    المصدر: كتاب الفقه المقارن، صفحة ٤٢-٤٣
                    <span className="opacity-70">(Sumber: Kitab Fikih Muqoron, hal. 42-43)</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Diktat Section */}
      <section id="diktat" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold">Diktat Pilihan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pilih diktat yang ingin Anda pelajari dan mulai diskusi dengan AI yang memahami konten
              diktat tersebut secara mendalam.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDiktats.map((diktat) => (
              <motion.div
                key={diktat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: diktat.delay }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative"
                onMouseEnter={() => setHoveredDiktat(diktat.id)}
                onMouseLeave={() => setHoveredDiktat(null)}
              >
                <Link
                  href={`/diktat/${diktat.id}`}
                  className={cn(
                    'block h-full rounded-xl overflow-hidden',
                    'bg-gradient-to-br',
                    diktat.color,
                    'shadow-lg transition-all',
                    hoveredDiktat === diktat.id ? 'shadow-xl' : 'shadow-md',
                  )}
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="text-4xl mb-4">{diktat.icon}</div>
                    <h3 className={cn('text-2xl font-bold mb-2', diktat.textColor)}>
                      {diktat.title}
                    </h3>
                    <p className={cn('text-sm opacity-90 mb-4', diktat.textColor)}>
                      {diktat.description}
                    </p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className={cn('text-sm font-medium', diktat.textColor)}>
                        Mulai belajar
                      </span>
                      <ArrowRightIcon className={cn('h-5 w-5', diktat.textColor)} />
                    </div>
                  </div>
                </Link>

                {hoveredDiktat === diktat.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -bottom-2 -right-2 bg-background rounded-full h-10 w-10 flex items-center justify-center shadow-md border border-border"
                  >
                    <ChatBubbleIcon className="h-5 w-5 text-primary" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button variant="outline" size="lg" asChild>
              <Link href="/chat/new">
                Lihat Semua Diktat <ArrowRightIcon className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold">Fitur Unggulan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nikmati pengalaman belajar yang interaktif dan efisien dengan fitur-fitur canggih yang
              mendukung pemahaman materi diktat.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <motion.div
          className="max-w-5xl mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8 md:p-12 text-primary-foreground relative overflow-hidden">
            {/* Animated dots */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white/10"
                  initial={{
                    x: Math.random() * 100 - 50 + '%',
                    y: Math.random() * 100 - 50 + '%',
                    opacity: Math.random() * 0.5 + 0.2,
                  }}
                  animate={{
                    x: [null, Math.random() * 100 - 50 + '%'],
                    y: [null, Math.random() * 100 - 50 + '%'],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 15,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-4">
                    Mulai Belajar dengan AI <span className="text-white">Sekarang</span>
                  </h2>
                  <p className="text-primary-foreground/80 max-w-lg">
                    Dapatkan pemahaman materi diktat yang lebih baik melalui diskusi interaktif
                    dengan AI yang dilatih khusus untuk memahami referensi dan konteks materi
                    kuliah.
                  </p>
                </div>
                <div>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="shadow-lg hover:shadow-xl transition-all"
                    asChild
                  >
                    <Link href="/chat/new">
                      Mulai Sekarang <ArrowRightIcon className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BookOpenIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">DiktatRAG</span>
          </div>

          <div className="text-sm text-muted-foreground">
            Logged in as <span className="font-medium">{CURRENT_USER}</span> •{' '}
            {new Date(CURRENT_DATETIME).toLocaleString()}
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <Button variant="ghost" size="icon">
              <StarIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/chat/new">
                <ChatBubbleIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
