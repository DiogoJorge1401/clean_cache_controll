import {
  CacheStoreSpy,
  getCacheExpirationDate,
  mockPurchases
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

describe('LocalLoadPurchases', () => {
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

  it('Should return a list of purchases if cache is valid', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)

    timestamp.setSeconds(timestamp.getSeconds() + 1)

    const { cacheStore, sut } = makeSut(currentDate)

    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    }

    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(purchases).toEqual(cacheStore.fetchResult.value)
  })

  it('Should return an empty list if cache is expired', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)

    timestamp.setSeconds(timestamp.getSeconds() - 1)

    const { cacheStore, sut } = makeSut(currentDate)

    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    }
    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(purchases).toEqual([])
  })

  it('Should return an empty list if cache is on expiration date', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)

    const { cacheStore, sut } = makeSut(currentDate)

    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    }
    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(purchases).toEqual([])
  })

  it('Should return an empty list if cache is empty', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)

    timestamp.setSeconds(timestamp.getSeconds() + 1)

    const { cacheStore, sut } = makeSut(currentDate)

    cacheStore.fetchResult = {
      timestamp,
      value: [],
    }

    const purchases = await sut.loadAll()

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(purchases).toEqual([])
  })
})
