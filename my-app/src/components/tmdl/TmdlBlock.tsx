interface TmdlBlockProps {
  code: string
}

export function TmdlBlock({ code }: TmdlBlockProps) {
  return (
    <div className="rounded-md border bg-neutral-950 dark:bg-neutral-900 overflow-auto">
      <pre className="p-4 text-sm font-mono text-green-400 leading-relaxed whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  )
}
