export interface CacheStore {
  delete(key: string): Promise<void>
  insert(key: string, value: any): Promise<void>
}
