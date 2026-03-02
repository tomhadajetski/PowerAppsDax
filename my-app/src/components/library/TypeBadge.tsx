import { Badge } from "@/components/ui/badge"

type ItemType = "measure" | "function" | "package"

const TYPE_CONFIG: Record<ItemType, { label: string; className: string }> = {
  measure: { label: "Measure", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  function: { label: "Function", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  package: { label: "Package", className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
}

interface TypeBadgeProps {
  type: ItemType
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const config = TYPE_CONFIG[type]
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  )
}
