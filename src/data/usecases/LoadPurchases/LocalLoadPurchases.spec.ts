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

describe('LocalLoadPurchases', () => {
  it('Should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut()

    expect(cacheStore.actions).toEqual([])
  })

  it('Should not insert new Cache if delete fails', () => {
    const { cacheStore, sut } = makeSut()

    cacheStore.simulateDeleteError()

    expect(sut.save(mockPurchases())).rejects.toThrow()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete])
  })

  it('Should insert new Cache if delete succeeds', async () => {
    const timestamp = new Date()
    const { cacheStore, sut } = makeSut(timestamp)
    const purchases = mockPurchases()

    const promise = sut.save(purchases)

    expect(promise).resolves.not.toThrow()

    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.delete,
      CacheStoreSpy.Action.insert,
    ])

    expect(cacheStore.deleteKey).toBe('purchases')

    expect(cacheStore.insertKey).toBe('purchases')

    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases,
    })

    await expect(promise).resolves.not.toThrow()
  })

  it('Should throw if insert throws', async () => {
    const { cacheStore, sut } = makeSut()

    cacheStore.simulateInsertError()

    await expect(sut.save(mockPurchases())).rejects.toThrow()

    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.delete,
      CacheStoreSpy.Action.insert,
    ])
  })
})
