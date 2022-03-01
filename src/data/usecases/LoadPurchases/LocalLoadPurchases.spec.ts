import { CacheStoreSpy } from '@/data/tests'
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
  it('Should call correct key on load', async () => {
    const { cacheStore, sut } = makeSut()

    await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
  })
})
