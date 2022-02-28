import { CacheStore } from '@/data/protocols/cache'
import { SavePurchases } from '@/domain/usecases'

export class LocalSavePurchases implements SavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    await this.cacheStore.delete('purchaces')
    await this.cacheStore.insert('purchases', purchases)
  }
}
