import type { DaxMeasure } from "@/types"
import { mockMeasures } from "@/data/mock"
import { fetchRecords, fetchRecord, createRecord, updateRecord, deleteRecord } from "@/lib/dataverse"

const ENTITY = "cr_daxmeasures"

function mapRecord(r: Record<string, unknown>): DaxMeasure {
  return {
    id: r["cr_daxmeasureid"] as string,
    name: r["cr_name"] as string,
    displayName: r["cr_displayname"] as string,
    description: r["cr_description"] as string,
    daxExpression: r["cr_daxexpression"] as string,
    tableName: r["cr_tablename"] as string,
    formatString: r["cr_formatstring"] as string | undefined,
    displayFolder: r["cr_displayfolder"] as string | undefined,
    categoryId: r["cr_categoryid"] as string,
    tagIds: JSON.parse((r["cr_tagids"] as string) || "[]") as string[],
    isHidden: Boolean(r["cr_ishidden"]),
    createdAt: r["createdon"] as string,
    updatedAt: r["modifiedon"] as string,
  }
}

export async function getMeasures(): Promise<DaxMeasure[]> {
  if (import.meta.env.DEV) return mockMeasures
  const records = await fetchRecords(ENTITY)
  return records.map(mapRecord)
}

export async function getMeasure(id: string): Promise<DaxMeasure | null> {
  if (import.meta.env.DEV) return mockMeasures.find((m) => m.id === id) ?? null
  const record = await fetchRecord(ENTITY, id)
  return record ? mapRecord(record) : null
}

export async function createMeasure(data: Omit<DaxMeasure, "id" | "createdAt" | "updatedAt">): Promise<DaxMeasure> {
  if (import.meta.env.DEV) {
    const next: DaxMeasure = {
      ...data,
      id: `m-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockMeasures.push(next)
    return next
  }
  const record = await createRecord(ENTITY, {
    cr_name: data.name,
    cr_displayname: data.displayName,
    cr_description: data.description,
    cr_daxexpression: data.daxExpression,
    cr_tablename: data.tableName,
    cr_formatstring: data.formatString,
    cr_displayfolder: data.displayFolder,
    cr_categoryid: data.categoryId,
    cr_tagids: JSON.stringify(data.tagIds),
    cr_ishidden: data.isHidden,
  })
  return mapRecord(record)
}

export async function updateMeasure(id: string, data: Partial<Omit<DaxMeasure, "id" | "createdAt" | "updatedAt">>): Promise<DaxMeasure> {
  if (import.meta.env.DEV) {
    const idx = mockMeasures.findIndex((m) => m.id === id)
    if (idx === -1) throw new Error("Measure not found")
    mockMeasures[idx] = { ...mockMeasures[idx], ...data, updatedAt: new Date().toISOString() }
    return mockMeasures[idx]
  }
  const record = await updateRecord(ENTITY, id, {
    cr_name: data.name,
    cr_displayname: data.displayName,
    cr_description: data.description,
    cr_daxexpression: data.daxExpression,
    cr_tablename: data.tableName,
    cr_formatstring: data.formatString,
    cr_displayfolder: data.displayFolder,
    cr_categoryid: data.categoryId,
    cr_tagids: data.tagIds ? JSON.stringify(data.tagIds) : undefined,
    cr_ishidden: data.isHidden,
  })
  return mapRecord(record)
}

export async function deleteMeasure(id: string): Promise<void> {
  if (import.meta.env.DEV) {
    const idx = mockMeasures.findIndex((m) => m.id === id)
    if (idx !== -1) mockMeasures.splice(idx, 1)
    return
  }
  await deleteRecord(ENTITY, id)
}
