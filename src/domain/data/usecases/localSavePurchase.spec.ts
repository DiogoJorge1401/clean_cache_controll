class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}

  async save(): Promise<void> {
    this.cacheStore.delete('purchaces')
  }
}

interface CacheStore {
  deleteCallsCount: number
  key: string
  delete(key: string): Promise<void>
}

class CacheStoreSpy implements CacheStore {
  key: string
  deleteCallsCount: number = 0

  async delete(key: string): Promise<void> {
    this.deleteCallsCount += 1
    this.key = key
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
  it('Should call delete with correct key', async () => {
    const { cacheStore, sut } = makeSut()

    await sut.save()

    expect(cacheStore.key).toBe('purchaces')
  })
})
