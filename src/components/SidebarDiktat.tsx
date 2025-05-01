'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { BookOpenIcon } from 'lucide-react'
import { ChatBubbleIcon, ChevronDownIcon, ChevronRightIcon, PlusIcon } from '@radix-ui/react-icons'
import getDiktatAction from 'actions/get-diktat.action'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  useSidebar,
} from '@/components/ui/sidebar'

// Define TypeScript interfaces
interface Diktat {
  id: string
  title: string
  description: string
  icon: string
  chatCount: number
  status: 'published' | 'draft' | 'archived'
}

interface DiktatMenuProps {
  diktatList: Diktat[]
  isLoading: boolean
  diktatId: string | null
  expandedDiktats: Record<string, boolean>
  toggleDiktat: (id: string) => void
  handleNewChat: (diktatId: string) => void
  navigateToDiktat: (diktatId: string) => void
}

const CURRENT_USER = 'Iqbaladudu'

export function SidebarDiktat() {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedDiktats, setExpandedDiktats] = React.useState<Record<string, boolean>>({})
  const [diktatList, setDiktatList] = React.useState<Diktat[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  // Fetch diktat data on component mount
  React.useEffect(() => {
    const fetchDiktat = async () => {
      try {
        setIsLoading(true)
        const data = await getDiktatAction()

        if (Array.isArray(data)) {
          const formattedData: Diktat[] = data.map((diktat) => ({
            id: diktat.id,
            title: diktat.title,
            description: diktat.description || '',
            icon: diktat.icon || '📚',
            chatCount: diktat.chatCount || 0,
            status: (diktat.status || 'published') as Diktat['status'],
          }))
          setDiktatList(formattedData)
        } else {
          console.error('Data returned is not an array:', data)
          setDiktatList([])
        }
      } catch (error) {
        console.error('Error fetching diktat:', error)
        setDiktatList([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiktat()
  }, [])

  // Extract diktatId and chatId from pathname
  const { diktatId, chatId } = React.useMemo(() => {
    const match = pathname.match(/^\/diktat\/([^\/]+)(?:\/chat\/([^\/]+))?$/)
    return {
      diktatId: match?.[1] || null,
      chatId: match?.[2] || null,
    }
  }, [pathname])

  // Toggle expand/collapse for a diktat
  const toggleDiktat = (id: string) => {
    setExpandedDiktats((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Navigate to diktat page
  const navigateToDiktat = (diktatId: string) => {
    router.push(`/diktat/${diktatId}`)
  }

  // Start a new chat for a diktat
  const handleNewChat = (diktatId: string) => {
    const uuid = self.crypto.randomUUID()
    router.push(`/diktat/${diktatId}/chat/${uuid}`)
  }

  return (
    <SidebarDiktatContent
      diktatList={diktatList}
      isLoading={isLoading}
      diktatId={diktatId}
      expandedDiktats={expandedDiktats}
      toggleDiktat={toggleDiktat}
      handleNewChat={handleNewChat}
      navigateToDiktat={navigateToDiktat}
    />
  )
}

// Separated content component to use the useSidebar hook
function SidebarDiktatContent({
  diktatList,
  isLoading,
  diktatId,
  expandedDiktats,
  toggleDiktat,
  handleNewChat,
  navigateToDiktat,
}: DiktatMenuProps) {
  const { toggleSidebar, state, isMobile, setOpenMobile } = useSidebar()

  return (
    <>
      {/* Desktop Sidebar */}
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader
          className={`flex flex-row items-center py-3 px-4 ${state === 'expanded' ? 'justify-between' : 'justify-center'}`}
        >
          {state === 'expanded' && <span className="font-bold text-lg">Diktat Kuliah</span>}
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <DiktatMenu
            diktatList={diktatList}
            isLoading={isLoading}
            diktatId={diktatId}
            expandedDiktats={expandedDiktats}
            toggleDiktat={toggleDiktat}
            handleNewChat={handleNewChat}
            navigateToDiktat={(id) => {
              navigateToDiktat(id)
              if (isMobile) setOpenMobile(false)
            }}
          />
        </SidebarContent>
        {/* {state === 'expanded' && (
          <SidebarFooter className="border-t p-3">
            <div className="text-xs text-muted-foreground">
              <span className="truncate">Login: {CURRENT_USER}</span>
            </div>
          </SidebarFooter>
        )} */}
      </Sidebar>
    </>
  )
}

// Separate component for the diktat menu items
function DiktatMenu({
  diktatList,
  isLoading,
  diktatId,
  expandedDiktats,
  toggleDiktat,
  handleNewChat,
  navigateToDiktat,
}: DiktatMenuProps) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  // Loading state
  if (isLoading) {
    return (
      <SidebarGroup>
        <div className="flex justify-center py-4">
          <p className="text-sm text-muted-foreground">Memuat diktat...</p>
        </div>
      </SidebarGroup>
    )
  }

  // Empty state
  if (diktatList.length === 0) {
    return (
      <SidebarGroup>
        <div className="flex justify-center py-4">
          <p className="text-sm text-muted-foreground">Tidak ada diktat tersedia</p>
        </div>
      </SidebarGroup>
    )
  }

  // Render diktat list
  return (
    <ScrollArea className="h-full">
      <SidebarMenu>
        {diktatList
          .filter((diktat) => diktat.status !== 'archived')
          .map((diktat) => {
            const isDiktatActive = diktatId === diktat.id
            const isDiktatExpanded = expandedDiktats[diktat.id] || isDiktatActive
            const isDraft = diktat.status === 'draft'

            return (
              <SidebarMenuItem key={diktat.id} className="mb-1 flex justify-center">
                {isCollapsed ? (
                  // Icon-only view when sidebar is collapsed
                  <SidebarMenuButton
                    isActive={isDiktatActive}
                    className={cn(isDraft && 'opacity-70')}
                    onClick={() => navigateToDiktat(diktat.id)}
                    tooltip={diktat.title}
                    aria-disabled={isDraft}
                  >
                    <span>{diktat.icon}</span>
                  </SidebarMenuButton>
                ) : (
                  // Full view with collapsible content
                  <Collapsible
                    open={isDiktatExpanded}
                    onOpenChange={() => !isDraft && toggleDiktat(diktat.id)}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={isDiktatActive}
                        className={cn('w-full justify-between', isDraft && 'opacity-70')}
                        aria-disabled={isDraft}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{diktat.icon}</span>
                          <span className="truncate">{diktat.title}</span>
                          <span className="ml-2 text-xs font-normal text-yellow-500 px-1.5 py-0.5 rounded">
                            {isDraft ? 'Coming soon' : 'Preview'}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-2 py-1">
                      {isDraft ? (
                        <div className="px-3 py-2 text-xs text-muted-foreground">
                          Diktat masih dalam persiapan. Nantikan segera!
                        </div>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left text-muted-foreground hover:text-foreground"
                            onClick={() => handleNewChat(diktat.id)}
                          >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            <span>Chat Baru</span>
                          </Button>
                          <Separator className="my-1" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left"
                            onClick={() => navigateToDiktat(diktat.id)}
                          >
                            <span className="text-xs text-muted-foreground">
                              Lihat semua ({diktat.chatCount})
                            </span>
                          </Button>
                        </>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                )}
                {isCollapsed && diktat.chatCount > 0 && !isDraft && (
                  <SidebarMenuBadge>{diktat.chatCount}</SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            )
          })}
      </SidebarMenu>
    </ScrollArea>
  )
}
