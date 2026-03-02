import { useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useTags } from "@/hooks/use-categories"

interface TagSelectorProps {
  selectedTagIds: string[]
  onChange: (tagIds: string[]) => void
  label?: string
}

export function TagSelector({ selectedTagIds, onChange, label = "Tags" }: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const { data: tags = [] } = useTags()

  function toggle(tagId: string) {
    onChange(
      selectedTagIds.includes(tagId)
        ? selectedTagIds.filter((t) => t !== tagId)
        : [...selectedTagIds, tagId]
    )
  }

  const selectedTags = tags.filter((t) => selectedTagIds.includes(t.id))

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1 mb-1">
        {selectedTags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="gap-1">
            {tag.name}
            <button
              type="button"
              onClick={() => toggle(tag.id)}
              className="hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between font-normal" role="combobox">
            Select tags…
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0">
          <Command>
            <CommandInput placeholder="Search tags…" />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {tags.map((tag) => (
                  <CommandItem key={tag.id} onSelect={() => toggle(tag.id)}>
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedTagIds.includes(tag.id) ? "opacity-100" : "opacity-0")}
                    />
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
