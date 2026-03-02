import { Link, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Pencil, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TypeBadge } from "@/components/library/TypeBadge"
import { TmdlBlock } from "@/components/tmdl/TmdlBlock"
import { useSelectionStore } from "@/stores/selection-store"
import { useUdf } from "@/hooks/use-udfs"
import { useCategories, useTags } from "@/hooks/use-categories"

const isAdmin = import.meta.env.VITE_ADMIN_MODE === "true"

export default function FunctionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: udf, isLoading } = useUdf(id ?? "")
  const { data: categories = [] } = useCategories()
  const { data: tags = [] } = useTags()
  const { selectedUdfIds, toggle } = useSelectionStore()

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!udf) {
    return (
      <div className="p-6 flex flex-col items-center gap-4 py-20 text-muted-foreground">
        <p>Function not found.</p>
        <Button variant="outline" onClick={() => navigate("/")}>Back to Library</Button>
      </div>
    )
  }

  const category = categories.find((c) => c.id === udf.categoryId)
  const udfTags = tags.filter((t) => udf.tagIds.includes(t.id))
  const isSelected = selectedUdfIds.has(udf.id)

  // Reconstruct the full TMDL function signature for display
  const functionSignature = `function '${udf.displayName}' =\n    (${udf.parameters}) =>\n        ${udf.daxExpression.replace(/\n/g, "\n        ")}`

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
            <TypeBadge type="function" />
            {category && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${category.color}22`, color: category.color }}
              >
                {category.name}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold">{udf.displayName}</h1>
          <p className="text-sm text-muted-foreground font-mono">{udf.name}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <Link to={`/admin/functions/${udf.id}/edit`}>
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
            onClick={() => toggle("udf", udf.id)}
          >
            {isSelected ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {isSelected ? "Remove" : "Add to selection"}
          </Button>
        </div>
      </div>

      {udf.description && (
        <p className="text-sm leading-relaxed">{udf.description}</p>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">TMDL Function</h2>
        <TmdlBlock code={functionSignature} />
      </div>

      {udf.returnDescription && (
        <div>
          <h2 className="text-sm font-semibold mb-1">Returns</h2>
          <p className="text-sm text-muted-foreground">{udf.returnDescription}</p>
        </div>
      )}

      {udfTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {udfTags.map((tag) => (
            <Badge key={tag.id} variant="outline">{tag.name}</Badge>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Last updated {new Date(udf.updatedAt).toLocaleDateString()}
      </p>
    </div>
  )
}
