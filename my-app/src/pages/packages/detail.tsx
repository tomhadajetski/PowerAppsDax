import { Link, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Pencil, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { TypeBadge } from "@/components/library/TypeBadge"
import { useSelectionStore } from "@/stores/selection-store"
import { usePackage } from "@/hooks/use-packages"
import { useMeasures } from "@/hooks/use-measures"
import { useUdfs } from "@/hooks/use-udfs"
import { useCategories, useTags } from "@/hooks/use-categories"

const isAdmin = import.meta.env.VITE_ADMIN_MODE === "true"

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: pkg, isLoading } = usePackage(id ?? "")
  const { data: allMeasures = [] } = useMeasures()
  const { data: allUdfs = [] } = useUdfs()
  const { data: categories = [] } = useCategories()
  const { data: tags = [] } = useTags()
  const { selectedPackageIds, toggle } = useSelectionStore()

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!pkg) {
    return (
      <div className="p-6 flex flex-col items-center gap-4 py-20 text-muted-foreground">
        <p>Package not found.</p>
        <Button variant="outline" onClick={() => navigate("/")}>Back to Library</Button>
      </div>
    )
  }

  const category = categories.find((c) => c.id === pkg.categoryId)
  const pkgTags = tags.filter((t) => pkg.tagIds.includes(t.id))
  const includedMeasures = allMeasures.filter((m) => pkg.measureIds.includes(m.id))
  const includedUdfs = allUdfs.filter((u) => pkg.udfIds.includes(u.id))
  const isSelected = selectedPackageIds.has(pkg.id)

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
            <TypeBadge type="package" />
            {category && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${category.color}22`, color: category.color }}
              >
                {category.name}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold">{pkg.displayName}</h1>
          <p className="text-sm text-muted-foreground font-mono">{pkg.name}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <Link to={`/admin/packages/${pkg.id}/edit`}>
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
            onClick={() => toggle("package", pkg.id)}
          >
            {isSelected ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {isSelected ? "Remove" : "Add to selection"}
          </Button>
        </div>
      </div>

      {pkg.description && (
        <p className="text-sm leading-relaxed">{pkg.description}</p>
      )}

      <div className="flex items-center gap-3">
        <Badge variant="outline">{includedMeasures.length} measure{includedMeasures.length !== 1 ? "s" : ""}</Badge>
        <Badge variant="outline">{includedUdfs.length} function{includedUdfs.length !== 1 ? "s" : ""}</Badge>
      </div>

      {includedMeasures.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">Included Measures</h2>
          <div className="flex flex-col gap-1">
            {includedMeasures.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-1.5 px-3 rounded-md bg-muted/50">
                <div className="flex flex-col">
                  <Link to={`/measures/${m.id}`} className="text-sm font-medium hover:underline">{m.displayName}</Link>
                  <span className="text-xs text-muted-foreground font-mono">{m.tableName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {includedUdfs.length > 0 && (
        <>
          {includedMeasures.length > 0 && <Separator />}
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold">Included Functions</h2>
            <div className="flex flex-col gap-1">
              {includedUdfs.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-1.5 px-3 rounded-md bg-muted/50">
                  <div className="flex flex-col">
                    <Link to={`/functions/${u.id}`} className="text-sm font-medium hover:underline">{u.displayName}</Link>
                    <span className="text-xs text-muted-foreground font-mono">({u.parameters || "…"})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {pkgTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {pkgTags.map((tag) => (
            <Badge key={tag.id} variant="outline">{tag.name}</Badge>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Last updated {new Date(pkg.updatedAt).toLocaleDateString()}
      </p>
    </div>
  )
}
