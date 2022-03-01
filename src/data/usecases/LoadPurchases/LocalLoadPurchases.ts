import { CacheStore } from '@/data/protocols/cache'
import { LoadPurchases, SavePurchases } from '@/domain/usecases'

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
  private readonly key = 'purchases'
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly currentDate: Date
  ) {}

  async loadAll(): Promise<Array<LoadPurchases.Result>> {
    try {
      const cache = this.cacheStore.fetch(this.key)

      const maxAge = new Date(cache.timestamp)

      maxAge.setDate(maxAge.getDate() + 3)

      if (maxAge >= this.currentDate) return cache.value

      throw new Error()
    } catch (err) {
      this.cacheStore.delete(this.key)

      return []
    }
  }

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace(this.key, {
      value: purchases,
      timestamp: this.currentDate,
    })
  }
}
