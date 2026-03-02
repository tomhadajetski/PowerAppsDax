import { Link } from "react-router-dom"
import { Plus, Minus } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TypeBadge } from "./TypeBadge"
import { useSelectionStore } from "@/stores/selection-store"
import type { Category, Tag } from "@/types"

type ItemType = "measure" | "function" | "package"

interface ItemCardProps {
  id: string
  type: ItemType
  displayName: string
  description: string
  category?: Category
  tags: Tag[]
}

export function ItemCard({ id, type, displayName, description, category, tags }: ItemCardProps) {
  const { selectedMeasureIds, selectedUdfIds, selectedPackageIds, toggle } = useSelectionStore()

  const isSelected =
    type === "measure"
      ? selectedMeasureIds.has(id)
      : type === "function"
        ? selectedUdfIds.has(id)
        : selectedPackageIds.has(id)

  const storeType = type === "function" ? "udf" : type

  const detailPath =
    type === "measure"
      ? `/measures/${id}`
      : type === "function"
        ? `/functions/${id}`
        : `/packages/${id}`

  return (
    <Card className={`flex flex-col transition-colors ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <TypeBadge type={type} />
            {category && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${category.color}22`, color: category.color }}
              >
                {category.name}
              </span>
            )}
          </div>
          <Button
            size="icon"
            variant={isSelected ? "default" : "outline"}
            className="shrink-0 h-7 w-7"
            onClick={() => toggle(storeType as "measure" | "udf" | "package", id)}
          >
            {isSelected ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </Button>
        </div>
        <Link to={detailPath} className="hover:underline">
          <h3 className="font-semibold text-sm leading-tight mt-1">{displayName}</h3>
        </Link>
      </CardHeader>
      <CardContent className="pt-0 flex-1 flex flex-col gap-3">
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs px-1.5 py-0">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
