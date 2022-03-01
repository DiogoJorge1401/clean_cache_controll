import { CacheStore } from '@/data/protocols/cache'
import { SavePurchases, LoadPurchases } from '@/domain/usecases'
import { PurchaseModel } from '@/domain/models'

export class LocalLoadPurchases implements SavePurchases {
  private readonly key = 'purchases'
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly timestamp: Date
  ) {}

  async loadAll(): Promise<void> {
    this.cacheStore.fetch(this.key)
  }

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace(this.key, {
      value: purchases,
      timestamp: this.timestamp,
    })
  }
}
