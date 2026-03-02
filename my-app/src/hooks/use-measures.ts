import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMeasures, getMeasure, createMeasure, updateMeasure, deleteMeasure } from "@/services/measures"
import type { DaxMeasure } from "@/types"

export const MEASURES_KEY = ["measures"] as const

export function useMeasures() {
  return useQuery({
    queryKey: MEASURES_KEY,
    queryFn: getMeasures,
  })
}

export function useMeasure(id: string) {
  return useQuery({
    queryKey: [...MEASURES_KEY, id],
    queryFn: () => getMeasure(id),
    enabled: Boolean(id),
  })
}

export function useCreateMeasure() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<DaxMeasure, "id" | "createdAt" | "updatedAt">) => createMeasure(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: MEASURES_KEY }),
  })
}

export function useUpdateMeasure() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<DaxMeasure, "id" | "createdAt" | "updatedAt">> }) =>
      updateMeasure(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: MEASURES_KEY }),
  })
}

export function useDeleteMeasure() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMeasure(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: MEASURES_KEY }),
  })
}
