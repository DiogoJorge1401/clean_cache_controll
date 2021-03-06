import { CachePolicy, CacheStore } from '@/data/protocols/cache'
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

      return CachePolicy.validate(cache.timestamp, this.currentDate)
        ? cache.value
        : []
    } catch (err) {
      return []
    }
  }

  validate(): void {
    try {
      const cache = this.cacheStore.fetch(this.key)

      const expired = !CachePolicy.validate(cache.timestamp, this.currentDate)

      if (expired) this.cacheStore.delete(this.key)
    } catch (error) {
      this.cacheStore.delete(this.key)
    }
  }

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace(this.key, {
      value: purchases,
      timestamp: this.currentDate,
    })
  }
}
