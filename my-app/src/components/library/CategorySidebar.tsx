import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useFilterStore } from "@/stores/filter-store"
import { useCategories, useTags } from "@/hooks/use-categories"

export function CategorySidebar() {
  const { categoryId, tagIds, setCategoryId, toggleTag } = useFilterStore()
  const { data: categories = [] } = useCategories()
  const { data: tags = [] } = useTags()

  return (
    <aside className="w-56 shrink-0 flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Category</h3>
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => setCategoryId(null)}
            className={cn(
              "text-left text-sm px-2 py-1.5 rounded-md hover:bg-accent transition-colors",
              categoryId === null && "bg-accent font-medium"
            )}
          >
            All categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryId(categoryId === cat.id ? null : cat.id)}
              className={cn(
                "text-left text-sm px-2 py-1.5 rounded-md hover:bg-accent transition-colors flex items-center gap-2",
                categoryId === cat.id && "bg-accent font-medium"
              )}
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {tags.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <button key={tag.id} onClick={() => toggleTag(tag.id)}>
                  <Badge
                    variant={tagIds.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    {tag.name}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {(categoryId !== null || tagIds.length > 0) && (
        <>
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            onClick={() => {
              setCategoryId(null)
              tagIds.forEach((t) => toggleTag(t))
            }}
          >
            Clear filters
          </Button>
        </>
      )}
    </aside>
  )
}
