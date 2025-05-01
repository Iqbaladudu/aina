import './styles.css'
import { ReactNode } from 'react'
import { SidebarDiktat } from '@/components/SidebarDiktat'
import { cn } from '@/lib/utils'
import ReactQueryProvider from '@/components/ReactQueryProvider'
import { ThemeProvider } from 'next-themes'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'Aina AI - An AI Powered Islamic Studies',
  description: 'Learn, ask, and discuss Islamic studies with AI',
  applicationName: 'AINA-AI',
}

export default function RootLayout({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <Analytics />
      <body className={cn('min-h-screen bg-background text-foreground antialiased')}>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <div className="flex h-screen w-screen overflow-hidden">
                <SidebarDiktat />
                <main className="flex-1 h-full overflow-y-auto">{children}</main>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
