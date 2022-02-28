import { SavePurchases } from '@/domain/usecases'
import { CacheStore } from '@/data/protocols/cache'

export class CacheStoreSpy implements CacheStore {
  messages: Array<CacheStoreSpy.Message> = []
  deleteKey: string
  insertKey: string
  insertValues: Array<SavePurchases.Params> = []

  async delete(key: string): Promise<void> {
    this.messages.push(CacheStoreSpy.Message.delete)
    this.deleteKey = key
  }
  async insert(key: string, values: any): Promise<void> {
    this.messages.push(CacheStoreSpy.Message.insert)
    this.insertKey = key
    this.insertValues = values
  }
  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.delete)
      throw new Error()
    })
  }
  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.insert)
      throw new Error()
    })
  }
}

export namespace CacheStoreSpy {
  export enum Message {
    delete,
    insert,
  }
}
