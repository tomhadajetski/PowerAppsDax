import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUdfs, getUdf, createUdf, updateUdf, deleteUdf } from "@/services/udfs"
import type { DaxUdf } from "@/types"

export const UDFS_KEY = ["udfs"] as const

export function useUdfs() {
  return useQuery({
    queryKey: UDFS_KEY,
    queryFn: getUdfs,
  })
}

export function useUdf(id: string) {
  return useQuery({
    queryKey: [...UDFS_KEY, id],
    queryFn: () => getUdf(id),
    enabled: Boolean(id),
  })
}

export function useCreateUdf() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<DaxUdf, "id" | "createdAt" | "updatedAt">) => createUdf(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: UDFS_KEY }),
  })
}

export function useUpdateUdf() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<DaxUdf, "id" | "createdAt" | "updatedAt">> }) =>
      updateUdf(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: UDFS_KEY }),
  })
}

export function useDeleteUdf() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUdf(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: UDFS_KEY }),
  })
}
