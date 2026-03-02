import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFilterStore } from "@/stores/filter-store"

export function SearchBar() {
  const { query, setQuery } = useFilterStore()

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search measures, functions, packages…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-9"
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => setQuery("")}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
