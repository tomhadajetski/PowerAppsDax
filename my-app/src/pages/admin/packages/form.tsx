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
import { TagSelector } from "@/components/forms/TagSelector"
import { MeasureSelector } from "@/components/forms/MeasureSelector"
import { usePackage, useCreatePackage, useUpdatePackage, useDeletePackage } from "@/hooks/use-packages"
import { useCategories } from "@/hooks/use-categories"
import type { DaxPackage } from "@/types"

type FormData = Omit<DaxPackage, "id" | "createdAt" | "updatedAt">

const DEFAULT_FORM: FormData = {
  name: "",
  displayName: "",
  description: "",
  categoryId: "",
  tagIds: [],
  measureIds: [],
  udfIds: [],
}

export default function PackageFormPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const { data: existing } = usePackage(id ?? "")
  const { data: categories = [] } = useCategories()
  const createMutation = useCreatePackage()
  const updateMutation = useUpdatePackage()
  const deleteMutation = useDeletePackage()

  const [form, setForm] = useState<FormData>(DEFAULT_FORM)

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        displayName: existing.displayName,
        description: existing.description,
        categoryId: existing.categoryId,
        tagIds: existing.tagIds,
        measureIds: existing.measureIds,
        udfIds: existing.udfIds,
      })
    }
  }, [existing])

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: form })
        toast.success("Package updated")
        navigate(`/packages/${id}`)
      } else {
        const created = await createMutation.mutateAsync(form)
        toast.success("Package created")
        navigate(`/packages/${created.id}`)
      }
    } catch {
      toast.error("Failed to save package")
    }
  }

  async function handleDelete() {
    if (!id || !confirm("Delete this package?")) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success("Package deleted")
      navigate("/")
    } catch {
      toast.error("Failed to delete package")
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="p-6 flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to={isEdit && id ? `/packages/${id}` : "/"}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {isEdit ? "Back to Package" : "Back to Library"}
          </Button>
        </Link>
      </div>

      <h1 className="text-xl font-semibold">{isEdit ? "Edit Package" : "New Package"}</h1>

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
            rows={3}
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

        <MeasureSelector
          selectedMeasureIds={form.measureIds}
          selectedUdfIds={form.udfIds}
          onMeasureChange={(ids) => set("measureIds", ids)}
          onUdfChange={(ids) => set("udfIds", ids)}
        />

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : isEdit ? "Save changes" : "Create package"}
            </Button>
            <Link to={isEdit && id ? `/packages/${id}` : "/"}>
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
