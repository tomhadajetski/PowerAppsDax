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
import { useUdf, useCreateUdf, useUpdateUdf, useDeleteUdf } from "@/hooks/use-udfs"
import { useCategories } from "@/hooks/use-categories"
import type { DaxUdf } from "@/types"

type FormData = Omit<DaxUdf, "id" | "createdAt" | "updatedAt">

const DEFAULT_FORM: FormData = {
  name: "",
  displayName: "",
  description: "",
  parameters: "",
  daxExpression: "",
  returnDescription: "",
  categoryId: "",
  tagIds: [],
}

export default function FunctionFormPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const { data: existing } = useUdf(id ?? "")
  const { data: categories = [] } = useCategories()
  const createMutation = useCreateUdf()
  const updateMutation = useUpdateUdf()
  const deleteMutation = useDeleteUdf()

  const [form, setForm] = useState<FormData>(DEFAULT_FORM)

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        displayName: existing.displayName,
        description: existing.description,
        parameters: existing.parameters,
        daxExpression: existing.daxExpression,
        returnDescription: existing.returnDescription ?? "",
        categoryId: existing.categoryId,
        tagIds: existing.tagIds,
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
      returnDescription: form.returnDescription || undefined,
    }
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data })
        toast.success("Function updated")
        navigate(`/functions/${id}`)
      } else {
        const created = await createMutation.mutateAsync(data)
        toast.success("Function created")
        navigate(`/functions/${created.id}`)
      }
    } catch {
      toast.error("Failed to save function")
    }
  }

  async function handleDelete() {
    if (!id || !confirm("Delete this function?")) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success("Function deleted")
      navigate("/")
    } catch {
      toast.error("Failed to delete function")
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  // Live preview of the generated TMDL function signature
  const signaturePreview = form.displayName
    ? `function '${form.displayName}' =\n    (${form.parameters || "…"}) =>\n        ${form.daxExpression ? form.daxExpression.split("\n")[0] + (form.daxExpression.includes("\n") ? " …" : "") : "…"}`
    : ""

  return (
    <div className="p-6 flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to={isEdit && id ? `/functions/${id}` : "/"}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {isEdit ? "Back to Function" : "Back to Library"}
          </Button>
        </Link>
      </div>

      <h1 className="text-xl font-semibold">{isEdit ? "Edit Function" : "New Function"}</h1>

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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="parameters">Parameters <span className="text-destructive">*</span></Label>
          <Input
            id="parameters"
            value={form.parameters}
            onChange={(e) => set("parameters", e.target.value)}
            className="font-mono"
            placeholder="e.g. Numerator : DOUBLE VAL, Denominator : DOUBLE VAL"
            required
          />
          <p className="text-xs text-muted-foreground">
            Use TMDL type syntax: <code className="font-mono">Name : TYPE VAL</code> for scalars,{" "}
            <code className="font-mono">Name : TABLE</code> for tables. Separate multiple params with commas.
          </p>
        </div>

        <DaxExpressionField
          value={form.daxExpression}
          onChange={(v) => set("daxExpression", v)}
          label="Lambda Body"
          placeholder={"IF(\n    Denominator = 0,\n    BLANK(),\n    DIVIDE(Numerator, Denominator)\n)"}
          required
        />
        <p className="text-xs text-muted-foreground -mt-3">
          Enter just the expression after <code className="font-mono">=&gt;</code>. Parameters are available as plain names (no brackets).
        </p>

        {signaturePreview && (
          <div className="rounded-md border bg-neutral-950 dark:bg-neutral-900 p-3">
            <p className="text-xs text-muted-foreground mb-1.5">Generated TMDL preview:</p>
            <pre className="text-xs font-mono text-green-400 whitespace-pre">{signaturePreview}</pre>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="returnDescription">Return Value</Label>
          <Textarea
            id="returnDescription"
            value={form.returnDescription}
            onChange={(e) => set("returnDescription", e.target.value)}
            rows={2}
            placeholder="Describe what the function returns…"
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
              {isPending ? "Saving…" : isEdit ? "Save changes" : "Create function"}
            </Button>
            <Link to={isEdit && id ? `/functions/${id}` : "/"}>
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
