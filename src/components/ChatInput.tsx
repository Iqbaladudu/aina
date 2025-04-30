'use client'

import { useState } from 'react'

export const ChatInput = () => {
  const [value, setValue] = useState('')
  // handle send, shortcut, dsb.

  return (
    <form
      className="flex items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        // TODO: Trigger send
      }}
    >
      <textarea
        className="flex-1 rounded-lg border px-3 py-2 focus:outline-primary resize-none"
        value={value}
        rows={1}
        placeholder="Ketik pesan..."
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            // TODO: Trigger send
          }
        }}
      />
      <button
        type="submit"
        className="rounded px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition"
        disabled={!value.trim()}
      >
        Kirim
      </button>
    </form>
  )
}
