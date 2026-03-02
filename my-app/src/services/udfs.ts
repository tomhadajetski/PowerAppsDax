import type { DaxUdf } from "@/types"
import { mockUdfs } from "@/data/mock"
import { fetchRecords, fetchRecord, createRecord, updateRecord, deleteRecord } from "@/lib/dataverse"

const ENTITY = "cr_daxudfs"

function mapRecord(r: Record<string, unknown>): DaxUdf {
  return {
    id: r["cr_daxudfid"] as string,
    name: r["cr_name"] as string,
    displayName: r["cr_displayname"] as string,
    description: r["cr_description"] as string,
    parameters: (r["cr_parameters"] as string) || "",
    daxExpression: r["cr_daxexpression"] as string,
    returnDescription: r["cr_returndescription"] as string | undefined,
    categoryId: r["cr_categoryid"] as string,
    tagIds: JSON.parse((r["cr_tagids"] as string) || "[]") as string[],
    createdAt: r["createdon"] as string,
    updatedAt: r["modifiedon"] as string,
  }
}

export async function getUdfs(): Promise<DaxUdf[]> {
  if (import.meta.env.DEV) return mockUdfs
  const records = await fetchRecords(ENTITY)
  return records.map(mapRecord)
}

export async function getUdf(id: string): Promise<DaxUdf | null> {
  if (import.meta.env.DEV) return mockUdfs.find((u) => u.id === id) ?? null
  const record = await fetchRecord(ENTITY, id)
  return record ? mapRecord(record) : null
}

export async function createUdf(data: Omit<DaxUdf, "id" | "createdAt" | "updatedAt">): Promise<DaxUdf> {
  if (import.meta.env.DEV) {
    const next: DaxUdf = {
      ...data,
      id: `u-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockUdfs.push(next)
    return next
  }
  const record = await createRecord(ENTITY, {
    cr_name: data.name,
    cr_displayname: data.displayName,
    cr_description: data.description,
    cr_parameters: data.parameters,
    cr_daxexpression: data.daxExpression,
    cr_returndescription: data.returnDescription,
    cr_categoryid: data.categoryId,
    cr_tagids: JSON.stringify(data.tagIds),
  })
  return mapRecord(record)
}

export async function updateUdf(id: string, data: Partial<Omit<DaxUdf, "id" | "createdAt" | "updatedAt">>): Promise<DaxUdf> {
  if (import.meta.env.DEV) {
    const idx = mockUdfs.findIndex((u) => u.id === id)
    if (idx === -1) throw new Error("UDF not found")
    mockUdfs[idx] = { ...mockUdfs[idx], ...data, updatedAt: new Date().toISOString() }
    return mockUdfs[idx]
  }
  const record = await updateRecord(ENTITY, id, {
    cr_name: data.name,
    cr_displayname: data.displayName,
    cr_description: data.description,
    cr_parameters: data.parameters,
    cr_daxexpression: data.daxExpression,
    cr_returndescription: data.returnDescription,
    cr_categoryid: data.categoryId,
    cr_tagids: data.tagIds ? JSON.stringify(data.tagIds) : undefined,
  })
  return mapRecord(record)
}

export async function deleteUdf(id: string): Promise<void> {
  if (import.meta.env.DEV) {
    const idx = mockUdfs.findIndex((u) => u.id === id)
    if (idx !== -1) mockUdfs.splice(idx, 1)
    return
  }
  await deleteRecord(ENTITY, id)
}
