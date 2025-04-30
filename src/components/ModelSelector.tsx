'use client'

import React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AIModel } from 'types/enums'

interface ModelSelectorProps {
  selectedModel: AIModel
  onModelChange: (model: AIModel) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const models = Object.values(AIModel)
    .filter((value) => isNaN(Number(value)))
    .map((value) => ({ name: value }))

  // Temukan model yang sedang dipilih
  const currentModel = Object.values(AIModel).filter((arr) => arr === selectedModel)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {currentModel[0]}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Cari model..." />
          <CommandEmpty>Model tidak ditemukan.</CommandEmpty>
          <CommandGroup>
            {models.map((model) => (
              <CommandItem
                key={model.name}
                value={model.name}
                onSelect={() => {
                  onModelChange(model.name)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    currentModel[0] === model.name ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <div className="flex flex-col">
                  <span>{model.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
