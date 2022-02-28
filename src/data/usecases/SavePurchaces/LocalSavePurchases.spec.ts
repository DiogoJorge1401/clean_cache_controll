import { CacheStoreSpy, mockPurchases } from '@/data/tests'
import { LocalSavePurchases } from '@/data/usecases'

type SutTypes = {
  cacheStore: CacheStoreSpy
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

    await sut.save(mockPurchases())

    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchaces')
  })
  it('Should not insert new Cache if delete fails', () => {
    const { cacheStore, sut } = makeSut()

    cacheStore.simulateDeleteError()

    expect(sut.save(mockPurchases())).rejects.toThrow()
    expect(cacheStore.insertCallsCount).toBe(0)
  })
  it('Should insert new Cache if delete succeeds', async () => {
    const { cacheStore, sut } = makeSut()
    const purchases = mockPurchases()

    await sut.save(purchases)

    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.deleteCallsCount).toBe(1)

    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual(purchases)
  })
  it('Should throw if insert throws', () => {
    const { cacheStore, sut } = makeSut()

    cacheStore.simulateInsertError()

    expect(sut.save(mockPurchases())).rejects.toThrow()
  })
})
