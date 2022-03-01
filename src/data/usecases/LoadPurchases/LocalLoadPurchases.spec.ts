import { CacheStoreSpy, mockPurchases } from '@/data/tests'
import { LocalLoadPurchases } from '@/data/usecases'

type SutTypes = {
  cacheStore: CacheStoreSpy
  sut: LocalLoadPurchases
}

const makeSut = (timestamp: Date = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalLoadPurchases(cacheStore, timestamp)
  return {
    cacheStore,
    sut,
  }
}

describe('LocalSavePurchases', () => {
  it('Should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut()

    expect(cacheStore.actions).toEqual([])
  })
  it('Should return an empty list if loading fails', async () => {
    const { cacheStore, sut } = makeSut()

    cacheStore.simulateLoadError()

    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ])

    expect(purchases).toEqual([])
  })
  it('Should return a list of purchases if cache is less than 3 days old', async () => {

    const timestamp = new Date()

    const { cacheStore, sut } = makeSut(timestamp)

    cacheStore.fetchResult = {
      timestamp,
      value:mockPurchases()
    }

    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(purchases).toEqual(cacheStore.fetchResult.value)
  })
})
