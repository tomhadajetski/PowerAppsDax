import { useMemo } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchBar } from "@/components/library/SearchBar"
import { CategorySidebar } from "@/components/library/CategorySidebar"
import { ItemCard } from "@/components/library/ItemCard"
import { SelectionBasket } from "@/components/library/SelectionBasket"
import { useFilterStore } from "@/stores/filter-store"
import { useMeasures } from "@/hooks/use-measures"
import { useUdfs } from "@/hooks/use-udfs"
import { usePackages } from "@/hooks/use-packages"
import { useCategories, useTags } from "@/hooks/use-categories"
import type { Category, Tag } from "@/types"

function matches(
  item: { displayName: string; description: string; categoryId: string; tagIds: string[] },
  query: string,
  categoryId: string | null,
  tagIds: string[]
): boolean {
  const q = query.toLowerCase()
  if (q && !item.displayName.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) {
    return false
  }
  if (categoryId && item.categoryId !== categoryId) return false
  if (tagIds.length > 0 && !tagIds.every((t) => item.tagIds.includes(t))) return false
  return true
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-40 rounded-lg" />
      ))}
    </div>
  )
}

export default function LibraryPage() {
  const { query, categoryId, tagIds, activeTab, setTab } = useFilterStore()

  const { data: measures = [], isLoading: measuresLoading } = useMeasures()
  const { data: udfs = [], isLoading: udfsLoading } = useUdfs()
  const { data: packages = [], isLoading: packagesLoading } = usePackages()
  const { data: categories = [] } = useCategories()
  const { data: tags = [] } = useTags()

  const isLoading = measuresLoading || udfsLoading || packagesLoading

  const categoryMap = useMemo(
    () => new Map<string, Category>(categories.map((c) => [c.id, c])),
    [categories]
  )
  const tagMap = useMemo(
    () => new Map<string, Tag>(tags.map((t) => [t.id, t])),
    [tags]
  )

  const filteredMeasures = useMemo(
    () => measures.filter((m) => matches(m, query, categoryId, tagIds)),
    [measures, query, categoryId, tagIds]
  )
  const filteredUdfs = useMemo(
    () => udfs.filter((u) => matches(u, query, categoryId, tagIds)),
    [udfs, query, categoryId, tagIds]
  )
  const filteredPackages = useMemo(
    () => packages.filter((p) => matches(p, query, categoryId, tagIds)),
    [packages, query, categoryId, tagIds]
  )

  const showMeasures = activeTab === "all" || activeTab === "measures"
  const showFunctions = activeTab === "all" || activeTab === "functions"
  const showPackages = activeTab === "all" || activeTab === "packages"

  const totalVisible =
    (showMeasures ? filteredMeasures.length : 0) +
    (showFunctions ? filteredUdfs.length : 0) +
    (showPackages ? filteredPackages.length : 0)

  return (
    <div className="flex h-full">
      <div className="p-6 border-r">
        <CategorySidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 p-6 gap-4">
        <div className="flex flex-col gap-3">
          <SearchBar />
          <Tabs value={activeTab} onValueChange={(v) => setTab(v as "all" | "measures" | "functions" | "packages")}>
            <TabsList>
              <TabsTrigger value="all">All ({filteredMeasures.length + filteredUdfs.length + filteredPackages.length})</TabsTrigger>
              <TabsTrigger value="measures">Measures ({filteredMeasures.length})</TabsTrigger>
              <TabsTrigger value="functions">Functions ({filteredUdfs.length})</TabsTrigger>
              <TabsTrigger value="packages">Packages ({filteredPackages.length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <GridSkeleton />
        ) : totalVisible === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            No items match your search.
          </div>
        ) : (
          <div className="flex flex-col gap-6 overflow-auto">
            {showMeasures && filteredMeasures.length > 0 && (
              <section>
                {activeTab === "all" && (
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Measures
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMeasures.map((m) => (
                    <ItemCard
                      key={m.id}
                      id={m.id}
                      type="measure"
                      displayName={m.displayName}
                      description={m.description}
                      category={categoryMap.get(m.categoryId)}
                      tags={m.tagIds.map((t) => tagMap.get(t)).filter(Boolean) as Tag[]}
                    />
                  ))}
                </div>
              </section>
            )}

            {showFunctions && filteredUdfs.length > 0 && (
              <section>
                {activeTab === "all" && (
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Functions
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUdfs.map((u) => (
                    <ItemCard
                      key={u.id}
                      id={u.id}
                      type="function"
                      displayName={u.displayName}
                      description={u.description}
                      category={categoryMap.get(u.categoryId)}
                      tags={u.tagIds.map((t) => tagMap.get(t)).filter(Boolean) as Tag[]}
                    />
                  ))}
                </div>
              </section>
            )}

            {showPackages && filteredPackages.length > 0 && (
              <section>
                {activeTab === "all" && (
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Packages
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPackages.map((p) => (
                    <ItemCard
                      key={p.id}
                      id={p.id}
                      type="package"
                      displayName={p.displayName}
                      description={p.description}
                      category={categoryMap.get(p.categoryId)}
                      tags={p.tagIds.map((t) => tagMap.get(t)).filter(Boolean) as Tag[]}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <SelectionBasket />
    </div>
  )
}
