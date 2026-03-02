import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCategories,
  getTags,
  createCategory,
  updateCategory,
  deleteCategory,
  createTag,
  deleteTag,
} from "@/services/categories"
import type { Category, Tag } from "@/types"

export const CATEGORIES_KEY = ["categories"] as const
export const TAGS_KEY = ["tags"] as const

export function useCategories() {
  return useQuery({ queryKey: CATEGORIES_KEY, queryFn: getCategories })
}

export function useTags() {
  return useQuery({ queryKey: TAGS_KEY, queryFn: getTags })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Category, "id">) => createCategory(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Category, "id">> }) => updateCategory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  })
}

export function useCreateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Tag, "id">) => createTag(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TAGS_KEY }),
  })
}

export function useDeleteTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TAGS_KEY }),
  })
}
