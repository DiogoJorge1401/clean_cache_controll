import {
  CacheStoreSpy,
  getCacheExpirationDate,
  mockPurchases,
} from '@/data/tests'
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

describe('LocalValidatePurchases', () => {
  it('Should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut()

    expect(cacheStore.actions).toEqual([])
  })
  it('Should delete cache if loading fails', () => {
    const { cacheStore, sut } = makeSut()

    cacheStore.simulateLoadError()

    sut.validate()

    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ])

    expect(cacheStore.deleteKey).toBe('purchases')
  })
  it('Should has no side effect if load succeeds', () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)

    timestamp.setSeconds(timestamp.getSeconds() + 1)

    const { cacheStore, sut } = makeSut(currentDate)

    cacheStore.fetchResult = { timestamp }

    sut.validate()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
  })
})
