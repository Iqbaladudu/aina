'use client'
import { useEffect, useRef } from 'react'
import { ChatBubble } from './ChatBubble'

export const ChatHistory = () => {
  const messages = [
    { id: '1', sender: 'user', message: 'Apa itu RAG?', timestamp: '08:00' },
    {
      id: '2',
      sender: 'ai',
      message: 'RAG adalah Retrieval-Augmented Generation...',
      timestamp: '08:00',
    },
  ]

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col px-4 py-2 space-y-2 overflow-y-auto h-full">
      {messages.map((msg) => (
        <ChatBubble
          key={msg.id}
          message={msg.message}
          sender={msg.sender as 'ai' | 'user'}
          timestamp={msg.timestamp}
        />
      ))}
      <div ref={chatEndRef} />
    </div>
  )
}
