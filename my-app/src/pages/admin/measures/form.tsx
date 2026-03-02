import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { DaxExpressionField } from "@/components/forms/DaxExpressionField"
import { TagSelector } from "@/components/forms/TagSelector"
import { useMeasure, useCreateMeasure, useUpdateMeasure, useDeleteMeasure } from "@/hooks/use-measures"
import { useCategories } from "@/hooks/use-categories"
import type { DaxMeasure } from "@/types"

type FormData = Omit<DaxMeasure, "id" | "createdAt" | "updatedAt">

const DEFAULT_FORM: FormData = {
  name: "",
  displayName: "",
  description: "",
  daxExpression: "",
  tableName: "",
  formatString: "",
  displayFolder: "",
  categoryId: "",
  tagIds: [],
  isHidden: false,
}

export default function MeasureFormPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const { data: existing } = useMeasure(id ?? "")
  const { data: categories = [] } = useCategories()
  const createMutation = useCreateMeasure()
  const updateMutation = useUpdateMeasure()
  const deleteMutation = useDeleteMeasure()

  const [form, setForm] = useState<FormData>(DEFAULT_FORM)

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        displayName: existing.displayName,
        description: existing.description,
        daxExpression: existing.daxExpression,
        tableName: existing.tableName,
        formatString: existing.formatString ?? "",
        displayFolder: existing.displayFolder ?? "",
        categoryId: existing.categoryId,
        tagIds: existing.tagIds,
        isHidden: existing.isHidden,
      })
    }
  }, [existing])

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data: FormData = {
      ...form,
      formatString: form.formatString || undefined,
      displayFolder: form.displayFolder || undefined,
    }
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data })
        toast.success("Measure updated")
        navigate(`/measures/${id}`)
      } else {
        const created = await createMutation.mutateAsync(data)
        toast.success("Measure created")
        navigate(`/measures/${created.id}`)
      }
    } catch {
      toast.error("Failed to save measure")
    }
  }

  async function handleDelete() {
    if (!id || !confirm("Delete this measure?")) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success("Measure deleted")
      navigate("/")
    } catch {
      toast.error("Failed to delete measure")
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="p-6 flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to={isEdit && id ? `/measures/${id}` : "/"}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {isEdit ? "Back to Measure" : "Back to Library"}
          </Button>
        </Link>
      </div>

      <h1 className="text-xl font-semibold">{isEdit ? "Edit Measure" : "New Measure"}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="displayName">Display Name <span className="text-destructive">*</span></Label>
            <Input
              id="displayName"
              value={form.displayName}
              onChange={(e) => {
                set("displayName", e.target.value)
                if (!isEdit) set("name", e.target.value.replace(/\s+/g, ""))
              }}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Internal Name <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="font-mono"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
          />
        </div>

        <DaxExpressionField
          value={form.daxExpression}
          onChange={(v) => set("daxExpression", v)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tableName">Table Name <span className="text-destructive">*</span></Label>
            <Input
              id="tableName"
              value={form.tableName}
              onChange={(e) => set("tableName", e.target.value)}
              className="font-mono"
              placeholder="e.g. Financials"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="formatString">Format String</Label>
            <Input
              id="formatString"
              value={form.formatString}
              onChange={(e) => set("formatString", e.target.value)}
              className="font-mono"
              placeholder="e.g. $#,##0.00"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="displayFolder">Display Folder</Label>
          <Input
            id="displayFolder"
            value={form.displayFolder}
            onChange={(e) => set("displayFolder", e.target.value)}
            placeholder="e.g. Revenue\Time Intelligence"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Category</Label>
          <Select value={form.categoryId} onValueChange={(v) => set("categoryId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category…" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TagSelector
          selectedTagIds={form.tagIds}
          onChange={(ids) => set("tagIds", ids)}
        />

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : isEdit ? "Save changes" : "Create measure"}
            </Button>
            <Link to={isEdit && id ? `/measures/${id}` : "/"}>
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
          </div>
          {isEdit && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
