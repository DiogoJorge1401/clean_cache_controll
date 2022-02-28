import { SavePurchases } from '@/domain/usecases'
import { CacheStore } from '@/data/protocols/cache'

export class CacheStoreSpy implements CacheStore {
  insertCallsCount: number = 0
  deleteCallsCount: number = 0
  deleteKey: string
  insertKey: string
  insertValues: Array<SavePurchases.Params> = []

  async delete(key: string): Promise<void> {
    this.deleteCallsCount += 1
    this.deleteKey = key
  }
  async insert(key: string, values: any): Promise<void> {
    this.insertCallsCount += 1
    this.insertKey = key
    this.insertValues = values
  }
  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })
  }
  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      throw new Error()
    })
  }
}
