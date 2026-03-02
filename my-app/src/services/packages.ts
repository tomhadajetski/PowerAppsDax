import type { DaxPackage } from "@/types"
import { mockPackages } from "@/data/mock"
import { fetchRecords, fetchRecord, createRecord, updateRecord, deleteRecord } from "@/lib/dataverse"

const ENTITY = "cr_daxpackages"

function mapRecord(r: Record<string, unknown>): DaxPackage {
  return {
    id: r["cr_daxpackageid"] as string,
    name: r["cr_name"] as string,
    displayName: r["cr_displayname"] as string,
    description: r["cr_description"] as string,
    categoryId: r["cr_categoryid"] as string,
    tagIds: JSON.parse((r["cr_tagids"] as string) || "[]") as string[],
    measureIds: JSON.parse((r["cr_measureids"] as string) || "[]") as string[],
    udfIds: JSON.parse((r["cr_udfids"] as string) || "[]") as string[],
    createdAt: r["createdon"] as string,
    updatedAt: r["modifiedon"] as string,
  }
}

export async function getPackages(): Promise<DaxPackage[]> {
  if (import.meta.env.DEV) return mockPackages
  const records = await fetchRecords(ENTITY)
  return records.map(mapRecord)
}

export async function getPackage(id: string): Promise<DaxPackage | null> {
  if (import.meta.env.DEV) return mockPackages.find((p) => p.id === id) ?? null
  const record = await fetchRecord(ENTITY, id)
  return record ? mapRecord(record) : null
}

export async function createPackage(data: Omit<DaxPackage, "id" | "createdAt" | "updatedAt">): Promise<DaxPackage> {
  if (import.meta.env.DEV) {
    const next: DaxPackage = {
      ...data,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockPackages.push(next)
    return next
  }
  const record = await createRecord(ENTITY, {
    cr_name: data.name,
    cr_displayname: data.displayName,
    cr_description: data.description,
    cr_categoryid: data.categoryId,
    cr_tagids: JSON.stringify(data.tagIds),
    cr_measureids: JSON.stringify(data.measureIds),
    cr_udfids: JSON.stringify(data.udfIds),
  })
  return mapRecord(record)
}

export async function updatePackage(id: string, data: Partial<Omit<DaxPackage, "id" | "createdAt" | "updatedAt">>): Promise<DaxPackage> {
  if (import.meta.env.DEV) {
    const idx = mockPackages.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error("Package not found")
    mockPackages[idx] = { ...mockPackages[idx], ...data, updatedAt: new Date().toISOString() }
    return mockPackages[idx]
  }
  const record = await updateRecord(ENTITY, id, {
    cr_name: data.name,
    cr_displayname: data.displayName,
    cr_description: data.description,
    cr_categoryid: data.categoryId,
    cr_tagids: data.tagIds ? JSON.stringify(data.tagIds) : undefined,
    cr_measureids: data.measureIds ? JSON.stringify(data.measureIds) : undefined,
    cr_udfids: data.udfIds ? JSON.stringify(data.udfIds) : undefined,
  })
  return mapRecord(record)
}

export async function deletePackage(id: string): Promise<void> {
  if (import.meta.env.DEV) {
    const idx = mockPackages.findIndex((p) => p.id === id)
    if (idx !== -1) mockPackages.splice(idx, 1)
    return
  }
  await deleteRecord(ENTITY, id)
}
