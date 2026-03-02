import { Link, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Pencil, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TypeBadge } from "@/components/library/TypeBadge"
import { TmdlBlock } from "@/components/tmdl/TmdlBlock"
import { useSelectionStore } from "@/stores/selection-store"
import { useMeasure } from "@/hooks/use-measures"
import { useCategories, useTags } from "@/hooks/use-categories"

const isAdmin = import.meta.env.VITE_ADMIN_MODE === "true"

export default function MeasureDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: measure, isLoading } = useMeasure(id ?? "")
  const { data: categories = [] } = useCategories()
  const { data: tags = [] } = useTags()
  const { selectedMeasureIds, toggle } = useSelectionStore()

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!measure) {
    return (
      <div className="p-6 flex flex-col items-center gap-4 py-20 text-muted-foreground">
        <p>Measure not found.</p>
        <Button variant="outline" onClick={() => navigate("/")}>Back to Library</Button>
      </div>
    )
  }

  const category = categories.find((c) => c.id === measure.categoryId)
  const measureTags = tags.filter((t) => measure.tagIds.includes(t.id))
  const isSelected = selectedMeasureIds.has(measure.id)

  return (
    <div className="p-6 flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Library
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <TypeBadge type="measure" />
            {category && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${category.color}22`, color: category.color }}
              >
                {category.name}
              </span>
            )}
            {measure.isHidden && <Badge variant="outline">Hidden</Badge>}
          </div>
          <h1 className="text-2xl font-bold">{measure.displayName}</h1>
          <p className="text-sm text-muted-foreground font-mono">{measure.name}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <Link to={`/admin/measures/${measure.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            </Link>
          )}
          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            className="gap-2"
            onClick={() => toggle("measure", measure.id)}
          >
            {isSelected ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {isSelected ? "Remove" : "Add to selection"}
          </Button>
        </div>
      </div>

      {measure.description && (
        <p className="text-sm leading-relaxed">{measure.description}</p>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">DAX Expression</h2>
        <TmdlBlock code={measure.daxExpression} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide font-medium mb-1">Table</p>
          <p className="font-mono">{measure.tableName}</p>
        </div>
        {measure.formatString && (
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide font-medium mb-1">Format String</p>
            <p className="font-mono">{measure.formatString}</p>
          </div>
        )}
        {measure.displayFolder && (
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide font-medium mb-1">Display Folder</p>
            <p className="font-mono">{measure.displayFolder}</p>
          </div>
        )}
      </div>

      {measureTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {measureTags.map((tag) => (
            <Badge key={tag.id} variant="outline">{tag.name}</Badge>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Last updated {new Date(measure.updatedAt).toLocaleDateString()}
      </p>
    </div>
  )
}
