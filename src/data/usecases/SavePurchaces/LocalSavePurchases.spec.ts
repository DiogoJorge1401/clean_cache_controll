import { CacheStoreSpy, mockPurchases } from '@/data/tests'
import { LocalSavePurchases } from '@/data/usecases'

type SutTypes = {
  cacheStore: CacheStoreSpy
  sut: LocalSavePurchases
}

const makeSut = (timestamp: Date = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore, timestamp)
  return {
    cacheStore,
    sut,
  }
}

describe('LocalSavePurchases', () => {
  it('Should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut()

    expect(cacheStore.messages).toEqual([])
  })

  it('Should not insert new Cache if delete fails', async () => {
    const { cacheStore, sut } = makeSut()

    cacheStore.simulateDeleteError()

    await expect(sut.save(mockPurchases())).rejects.toThrow()
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])
  })

  it('Should insert new Cache if delete succeeds', async () => {
    const timestamp = new Date()
    const { cacheStore, sut } = makeSut(timestamp)
    const purchases = mockPurchases()

    await sut.save(purchases)

    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ])

    expect(cacheStore.deleteKey).toBe('purchaces')

    expect(cacheStore.insertKey).toBe('purchases')

    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases,
    })
  })

  it('Should throw if insert throws', async () => {
    const { cacheStore, sut } = makeSut()

    cacheStore.simulateInsertError()

    await expect(sut.save(mockPurchases())).rejects.toThrow()

    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ])
  })
})
