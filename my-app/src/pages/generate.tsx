import { useMemo } from "react"
import { Link } from "react-router-dom"
import { X, ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { TmdlBlock } from "@/components/tmdl/TmdlBlock"
import { CopyButton } from "@/components/tmdl/CopyButton"
import { TypeBadge } from "@/components/library/TypeBadge"
import { useSelectionStore } from "@/stores/selection-store"
import { useMeasures } from "@/hooks/use-measures"
import { useUdfs } from "@/hooks/use-udfs"
import { usePackages } from "@/hooks/use-packages"
import { generateTmdl } from "@/lib/tmdl"

export default function GeneratePage() {
  const { selectedMeasureIds, selectedUdfIds, selectedPackageIds, toggle, clear } = useSelectionStore()

  const { data: allMeasures = [] } = useMeasures()
  const { data: allUdfs = [] } = useUdfs()
  const { data: allPackages = [] } = usePackages()

  const selectedMeasures = useMemo(
    () => allMeasures.filter((m) => selectedMeasureIds.has(m.id)),
    [allMeasures, selectedMeasureIds]
  )
  const selectedUdfs = useMemo(
    () => allUdfs.filter((u) => selectedUdfIds.has(u.id)),
    [allUdfs, selectedUdfIds]
  )
  const selectedPackages = useMemo(
    () => allPackages.filter((p) => selectedPackageIds.has(p.id)),
    [allPackages, selectedPackageIds]
  )

  const tmdl = useMemo(
    () => generateTmdl(selectedMeasures, selectedUdfs, selectedPackages, allMeasures, allUdfs),
    [selectedMeasures, selectedUdfs, selectedPackages, allMeasures, allUdfs]
  )

  const totalCount = selectedMeasures.length + selectedUdfs.length + selectedPackages.length

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Generate TMDL</h1>
      </div>

      {totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
          <p>No items selected.</p>
          <Link to="/">
            <Button variant="outline">Browse Library</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selection panel */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-sm">Selected items ({totalCount})</h2>
              <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive" onClick={clear}>
                <Trash2 className="h-3.5 w-3.5" />
                Clear all
              </Button>
            </div>

            {selectedMeasures.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Measures</p>
                {selectedMeasures.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2 min-w-0">
                      <TypeBadge type="measure" />
                      <span className="text-sm truncate">{m.displayName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => toggle("measure", m.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {selectedUdfs.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Functions</p>
                {selectedUdfs.map((u) => (
                  <div key={u.id} className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-md hover:bg-muted">
                    <div className="flex items-center gap-2 min-w-0">
                      <TypeBadge type="function" />
                      <span className="text-sm truncate">{u.displayName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => toggle("udf", u.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {selectedPackages.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Packages</p>
                {selectedPackages.map((p) => (
                  <div key={p.id} className="flex flex-col gap-1 py-1.5 px-2 rounded-md hover:bg-muted">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <TypeBadge type="package" />
                        <span className="text-sm truncate">{p.displayName}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => toggle("package", p.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-2">
                      {p.measureIds.length > 0 && (
                        <Badge variant="outline" className="text-xs">{p.measureIds.length} measure{p.measureIds.length !== 1 ? "s" : ""}</Badge>
                      )}
                      {p.udfIds.length > 0 && (
                        <Badge variant="outline" className="text-xs">{p.udfIds.length} function{p.udfIds.length !== 1 ? "s" : ""}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="lg:hidden" />

          {/* TMDL output */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-sm">TMDL Output</h2>
              <CopyButton text={tmdl} />
            </div>
            <TmdlBlock code={tmdl} />
            <p className="text-xs text-muted-foreground">
              Paste this into Power BI Desktop's TMDL view (Model &gt; Edit TMDL).
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
