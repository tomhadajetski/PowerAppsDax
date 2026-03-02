import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getPackages, getPackage, createPackage, updatePackage, deletePackage } from "@/services/packages"
import type { DaxPackage } from "@/types"

export const PACKAGES_KEY = ["packages"] as const

export function usePackages() {
  return useQuery({
    queryKey: PACKAGES_KEY,
    queryFn: getPackages,
  })
}

export function usePackage(id: string) {
  return useQuery({
    queryKey: [...PACKAGES_KEY, id],
    queryFn: () => getPackage(id),
    enabled: Boolean(id),
  })
}

export function useCreatePackage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<DaxPackage, "id" | "createdAt" | "updatedAt">) => createPackage(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PACKAGES_KEY }),
  })
}

export function useUpdatePackage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<DaxPackage, "id" | "createdAt" | "updatedAt">> }) =>
      updatePackage(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PACKAGES_KEY }),
  })
}

export function useDeletePackage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePackage(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PACKAGES_KEY }),
  })
}
