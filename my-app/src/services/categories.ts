import type { Category, Tag } from "@/types"
import { mockCategories, mockTags } from "@/data/mock"
import { fetchRecords, createRecord, updateRecord, deleteRecord } from "@/lib/dataverse"

const CAT_ENTITY = "cr_daxcategories"
const TAG_ENTITY = "cr_daxtags"

function mapCategory(r: Record<string, unknown>): Category {
  return {
    id: r["cr_daxcategoryid"] as string,
    name: r["cr_name"] as string,
    description: r["cr_description"] as string,
    color: r["cr_color"] as string,
  }
}

function mapTag(r: Record<string, unknown>): Tag {
  return {
    id: r["cr_daxtagid"] as string,
    name: r["cr_name"] as string,
  }
}

export async function getCategories(): Promise<Category[]> {
  if (import.meta.env.DEV) return mockCategories
  const records = await fetchRecords(CAT_ENTITY)
  return records.map(mapCategory)
}

export async function getTags(): Promise<Tag[]> {
  if (import.meta.env.DEV) return mockTags
  const records = await fetchRecords(TAG_ENTITY)
  return records.map(mapTag)
}

export async function createCategory(data: Omit<Category, "id">): Promise<Category> {
  if (import.meta.env.DEV) {
    const next: Category = { ...data, id: `cat-${Date.now()}` }
    mockCategories.push(next)
    return next
  }
  const record = await createRecord(CAT_ENTITY, {
    cr_name: data.name,
    cr_description: data.description,
    cr_color: data.color,
  })
  return mapCategory(record)
}

export async function updateCategory(id: string, data: Partial<Omit<Category, "id">>): Promise<Category> {
  if (import.meta.env.DEV) {
    const idx = mockCategories.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error("Category not found")
    mockCategories[idx] = { ...mockCategories[idx], ...data }
    return mockCategories[idx]
  }
  const record = await updateRecord(CAT_ENTITY, id, {
    cr_name: data.name,
    cr_description: data.description,
    cr_color: data.color,
  })
  return mapCategory(record)
}

export async function deleteCategory(id: string): Promise<void> {
  if (import.meta.env.DEV) {
    const idx = mockCategories.findIndex((c) => c.id === id)
    if (idx !== -1) mockCategories.splice(idx, 1)
    return
  }
  await deleteRecord(CAT_ENTITY, id)
}

export async function createTag(data: Omit<Tag, "id">): Promise<Tag> {
  if (import.meta.env.DEV) {
    const next: Tag = { ...data, id: `tag-${Date.now()}` }
    mockTags.push(next)
    return next
  }
  const record = await createRecord(TAG_ENTITY, { cr_name: data.name })
  return mapTag(record)
}

export async function deleteTag(id: string): Promise<void> {
  if (import.meta.env.DEV) {
    const idx = mockTags.findIndex((t) => t.id === id)
    if (idx !== -1) mockTags.splice(idx, 1)
    return
  }
  await deleteRecord(TAG_ENTITY, id)
}
