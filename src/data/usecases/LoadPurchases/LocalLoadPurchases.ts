import { CacheStore } from '@/data/protocols/cache'
import { LoadPurchases, SavePurchases } from '@/domain/usecases'

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
  private readonly key = 'purchases'
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly timestamp: Date
  ) {}

  async loadAll(): Promise<Array<LoadPurchases.Result>> {
    try {
      const cache = this.cacheStore.fetch(this.key)
      return cache.value
    } catch (err) {
      this.cacheStore.delete(this.key)
      return []
    }
  }

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace(this.key, {
      value: purchases,
      timestamp: this.timestamp,
    })
  }
}
