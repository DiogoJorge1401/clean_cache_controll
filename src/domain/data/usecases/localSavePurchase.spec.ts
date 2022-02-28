class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}
}

interface CacheStore {
  deleteCallsCount: number
}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount: number = 0
}

describe('LocalSavePurchases', () => {
  it('Should not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy()

    new LocalSavePurchases(cacheStore)

    expect(cacheStore.deleteCallsCount).toBe(0)
  })
})
