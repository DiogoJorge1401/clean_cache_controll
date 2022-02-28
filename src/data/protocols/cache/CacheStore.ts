export interface CacheStore {
  deleteCallsCount: number
  insertCallsCount: number
  key: string

  delete(key: string): Promise<void>
}