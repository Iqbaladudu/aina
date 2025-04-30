import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ChatBubbleProps {
  message: string
  sender: 'user' | 'ai'
  timestamp?: string
  avatarUrl?: string
}

export const ChatBubble = ({ message, sender, timestamp, avatarUrl }: ChatBubbleProps) => (
  <div
    className={cn('flex gap-2 my-2 items-end', sender === 'user' ? 'justify-end' : 'justify-start')}
  >
    {sender === 'ai' && (
      <Avatar>
        <AvatarImage src={avatarUrl} alt="User Avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    )}
    <div
      className={cn(
        'rounded-lg px-4 py-2 max-w-xs md:max-w-md transition-all',
        sender === 'user'
          ? 'bg-primary text-primary-foreground rounded-br-none'
          : 'bg-muted text-foreground rounded-bl-none',
      )}
    >
      {message}
      {timestamp && (
        <span className="block text-xs text-muted-foreground mt-1 text-right">{timestamp}</span>
      )}
    </div>
    {sender === 'user' && (
      <Avatar>
        <AvatarImage src={avatarUrl} alt="User Avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    )}
  </div>
)
