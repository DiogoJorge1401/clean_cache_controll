class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}

  async save(): Promise<void> {
    this.cacheStore.delete()
  }
}

interface CacheStore {
  deleteCallsCount: number
  delete(): Promise<void>
}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount: number = 0
  
  async delete(): Promise<void> {
    this.deleteCallsCount += 1
  }
}

describe('LocalSavePurchases', () => {
  it('Should not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy()

    new LocalSavePurchases(cacheStore)

    expect(cacheStore.deleteCallsCount).toBe(0)
  })
  it('Should delete old cache on sut.save', async () => {
    const cacheStore = new CacheStoreSpy()

    const sut = new LocalSavePurchases(cacheStore)

    await sut.save()

    expect(cacheStore.deleteCallsCount).toBe(1)
  })
})
