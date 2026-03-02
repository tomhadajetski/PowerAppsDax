import { Check } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useMeasures } from "@/hooks/use-measures"
import { useUdfs } from "@/hooks/use-udfs"

interface MeasureSelectorProps {
  selectedMeasureIds: string[]
  selectedUdfIds: string[]
  onMeasureChange: (ids: string[]) => void
  onUdfChange: (ids: string[]) => void
}

export function MeasureSelector({
  selectedMeasureIds,
  selectedUdfIds,
  onMeasureChange,
  onUdfChange,
}: MeasureSelectorProps) {
  const { data: measures = [] } = useMeasures()
  const { data: udfs = [] } = useUdfs()

  function toggleMeasure(id: string) {
    onMeasureChange(
      selectedMeasureIds.includes(id)
        ? selectedMeasureIds.filter((m) => m !== id)
        : [...selectedMeasureIds, id]
    )
  }

  function toggleUdf(id: string) {
    onUdfChange(
      selectedUdfIds.includes(id)
        ? selectedUdfIds.filter((u) => u !== id)
        : [...selectedUdfIds, id]
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label>Measures</Label>
        <div className="flex flex-wrap gap-1 mb-1">
          {selectedMeasureIds.map((id) => {
            const m = measures.find((x) => x.id === id)
            return m ? <Badge key={id} variant="secondary">{m.displayName}</Badge> : null
          })}
        </div>
        <Command className="border rounded-md">
          <CommandInput placeholder="Search measures…" />
          <CommandList className="max-h-40">
            <CommandEmpty>No measures found.</CommandEmpty>
            <CommandGroup>
              {measures.map((m) => (
                <CommandItem key={m.id} onSelect={() => toggleMeasure(m.id)}>
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedMeasureIds.includes(m.id) ? "opacity-100" : "opacity-0")}
                  />
                  {m.displayName}
                  <span className="ml-auto text-xs text-muted-foreground">{m.tableName}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Functions (UDFs)</Label>
        <div className="flex flex-wrap gap-1 mb-1">
          {selectedUdfIds.map((id) => {
            const u = udfs.find((x) => x.id === id)
            return u ? <Badge key={id} variant="secondary">{u.displayName}</Badge> : null
          })}
        </div>
        <Command className="border rounded-md">
          <CommandInput placeholder="Search functions…" />
          <CommandList className="max-h-40">
            <CommandEmpty>No functions found.</CommandEmpty>
            <CommandGroup>
              {udfs.map((u) => (
                <CommandItem key={u.id} onSelect={() => toggleUdf(u.id)}>
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedUdfIds.includes(u.id) ? "opacity-100" : "opacity-0")}
                  />
                  {u.displayName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  )
}
