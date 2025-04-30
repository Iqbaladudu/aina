interface Source {
  id: string
  score?: number
  title: string
  source?: string
  pageReference?: string
  content?: string
}

interface SourcesDisplayProps {
  sources: Source[]
}

export const SourcesDisplay = ({ sources }: SourcesDisplayProps) => {
  if (!sources || sources.length === 0) return null
  console.log(sources)

  return (
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Sumber Rujukan ({sources.length})
        </summary>
        <div className="flex flex-wrap">
          {sources.map((source) => (
            <div key={source.id} className="p-2 bg-muted/50 rounded-md">
              <div className="flex flex-wrap gap-2 mt-1">
                {source.pageReference && (
                  <div className="text-xs px-2 py-1 bg-primary/10 w-24 text-center rounded-full text-primary">
                    Halaman: {source.pageReference}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
