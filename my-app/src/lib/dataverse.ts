// Dataverse adapter — wraps @microsoft/power-apps SDK data client.
// If the SDK client is not available (local dev), throws so the mock layer can intercept.
// See: @microsoft/power-apps/data → getClient()

// We use a dynamic approach so the import doesn't break local dev builds.
// The Power Apps Vite plugin injects the dataSourcesInfo at runtime in production.

export interface DataverseRecord {
  [key: string]: unknown
}

type PowerAppsClient = {
  createRecordAsync: (tableName: string, record: DataverseRecord) => Promise<DataverseRecord>
  deleteRecordAsync: (tableName: string, recordId: string) => Promise<void>
  retrieveMultipleRecordsAsync: (tableName: string, options?: unknown) => Promise<{ value: DataverseRecord[] }>
  retrieveRecordAsync: (tableName: string, recordId: string, options?: unknown) => Promise<DataverseRecord>
  updateRecordAsync: (tableName: string, recordId: string, changes: DataverseRecord) => Promise<DataverseRecord>
}

let _client: PowerAppsClient | null = null

async function getClient(): Promise<PowerAppsClient> {
  if (_client) return _client
  // Power Apps Vite plugin sets window.__powerAppsDataSourcesInfo at runtime
  const dsInfo = (window as unknown as Record<string, unknown>)["__powerAppsDataSourcesInfo"]
  if (!dsInfo) {
    throw new Error("Power Apps data client not available — use mock data in dev mode.")
  }
  const { getClient: sdkGetClient } = await import("@microsoft/power-apps/data")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _client = sdkGetClient(dsInfo as any) as unknown as PowerAppsClient
  return _client
}

export async function fetchRecords(
  entityName: string,
  options?: { filter?: string; select?: string[] }
): Promise<DataverseRecord[]> {
  const client = await getClient()
  const opts: Record<string, string> = {}
  if (options?.filter) opts["$filter"] = options.filter
  if (options?.select) opts["$select"] = options.select.join(",")
  const result = await client.retrieveMultipleRecordsAsync(entityName, opts)
  return result.value
}

export async function fetchRecord(
  entityName: string,
  id: string
): Promise<DataverseRecord | null> {
  const client = await getClient()
  return client.retrieveRecordAsync(entityName, id)
}

export async function createRecord(
  entityName: string,
  data: DataverseRecord
): Promise<DataverseRecord> {
  const client = await getClient()
  return client.createRecordAsync(entityName, data)
}

export async function updateRecord(
  entityName: string,
  id: string,
  data: DataverseRecord
): Promise<DataverseRecord> {
  const client = await getClient()
  return client.updateRecordAsync(entityName, id, data)
}

export async function deleteRecord(entityName: string, id: string): Promise<void> {
  const client = await getClient()
  return client.deleteRecordAsync(entityName, id)
}
