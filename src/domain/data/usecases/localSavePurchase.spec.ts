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

type SutTypes = {
  cacheStore: CacheStore
  sut: LocalSavePurchases
}

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy()

  const sut = new LocalSavePurchases(cacheStore)

  return {
    cacheStore,
    sut,
  }
}

describe('LocalSavePurchases', () => {
  it('Should not delete cache on sut.init', () => {
    const { cacheStore } = makeSut()

    expect(cacheStore.deleteCallsCount).toBe(0)
  })
  it('Should delete old cache on sut.save', async () => {
    const { cacheStore, sut } = makeSut()

    await sut.save()

    expect(cacheStore.deleteCallsCount).toBe(1)
  })
})
