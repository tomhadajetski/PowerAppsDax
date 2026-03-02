import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Pencil, Check, X, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  useCategories,
  useTags,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateTag,
  useDeleteTag,
} from "@/hooks/use-categories"
import type { Category } from "@/types"

function CategoryRow({ cat }: { cat: Category }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(cat.name)
  const [description, setDescription] = useState(cat.description)
  const [color, setColor] = useState(cat.color)
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  async function save() {
    try {
      await updateMutation.mutateAsync({ id: cat.id, data: { name, description, color } })
      toast.success("Category updated")
      setEditing(false)
    } catch {
      toast.error("Failed to update category")
    }
  }

  async function remove() {
    if (!confirm("Delete this category?")) return
    try {
      await deleteMutation.mutateAsync(cat.id)
      toast.success("Category deleted")
    } catch {
      toast.error("Failed to delete category")
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-3 py-2">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer border" />
        <Input value={name} onChange={(e) => setName(e.target.value)} className="w-40" />
        <Input value={description} onChange={(e) => setDescription(e.target.value)} className="flex-1" placeholder="Description" />
        <Button size="icon" variant="ghost" onClick={save} disabled={updateMutation.isPending}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => setEditing(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="h-4 w-4 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
      <span className="w-40 font-medium text-sm">{cat.name}</span>
      <span className="flex-1 text-sm text-muted-foreground">{cat.description}</span>
      <Button size="icon" variant="ghost" onClick={() => setEditing(true)}>
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" variant="ghost" onClick={remove} disabled={deleteMutation.isPending}>
        <Trash2 className="h-3.5 w-3.5 text-destructive" />
      </Button>
    </div>
  )
}

export default function CategoriesPage() {
  const { data: categories = [] } = useCategories()
  const { data: tags = [] } = useTags()
  const createCategoryMutation = useCreateCategory()
  const createTagMutation = useCreateTag()
  const deleteTagMutation = useDeleteTag()

  const [newCatName, setNewCatName] = useState("")
  const [newCatDesc, setNewCatDesc] = useState("")
  const [newCatColor, setNewCatColor] = useState("#6366f1")
  const [newTagName, setNewTagName] = useState("")

  async function addCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!newCatName.trim()) return
    try {
      await createCategoryMutation.mutateAsync({ name: newCatName, description: newCatDesc, color: newCatColor })
      toast.success("Category created")
      setNewCatName("")
      setNewCatDesc("")
      setNewCatColor("#6366f1")
    } catch {
      toast.error("Failed to create category")
    }
  }

  async function addTag(e: React.FormEvent) {
    e.preventDefault()
    if (!newTagName.trim()) return
    try {
      await createTagMutation.mutateAsync({ name: newTagName })
      toast.success("Tag created")
      setNewTagName("")
    } catch {
      toast.error("Failed to create tag")
    }
  }

  async function removeTag(id: string) {
    try {
      await deleteTagMutation.mutateAsync(id)
      toast.success("Tag deleted")
    } catch {
      toast.error("Failed to delete tag")
    }
  }

  return (
    <div className="p-6 flex flex-col gap-8 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Library
          </Button>
        </Link>
      </div>

      <h1 className="text-xl font-semibold">Manage Categories & Tags</h1>

      {/* Admin quick links */}
      <div className="flex flex-wrap gap-2">
        <Link to="/admin/measures/new"><Button variant="outline" size="sm">+ New Measure</Button></Link>
        <Link to="/admin/functions/new"><Button variant="outline" size="sm">+ New Function</Button></Link>
        <Link to="/admin/packages/new"><Button variant="outline" size="sm">+ New Package</Button></Link>
      </div>

      <Separator />

      {/* Categories */}
      <section className="flex flex-col gap-4">
        <h2 className="font-medium">Categories</h2>
        <div className="flex flex-col divide-y">
          {categories.map((cat) => (
            <CategoryRow key={cat.id} cat={cat} />
          ))}
        </div>

        <form onSubmit={addCategory} className="flex items-center gap-3 pt-2">
          <input
            type="color"
            value={newCatColor}
            onChange={(e) => setNewCatColor(e.target.value)}
            className="h-8 w-8 rounded cursor-pointer border"
          />
          <Input
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Category name"
            className="w-40"
            required
          />
          <Input
            value={newCatDesc}
            onChange={(e) => setNewCatDesc(e.target.value)}
            placeholder="Description (optional)"
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={createCategoryMutation.isPending} className="gap-1">
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </form>
      </section>

      <Separator />

      {/* Tags */}
      <section className="flex flex-col gap-4">
        <h2 className="font-medium">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-1">
              <Badge variant="secondary">{tag.name}</Badge>
              <button
                onClick={() => removeTag(tag.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                disabled={deleteTagMutation.isPending}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addTag} className="flex items-center gap-3">
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name"
            className="w-48"
            required
          />
          <Button type="submit" size="sm" disabled={createTagMutation.isPending} className="gap-1">
            <Plus className="h-3.5 w-3.5" />
            Add Tag
          </Button>
        </form>
      </section>
    </div>
  )
}
