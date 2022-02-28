import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usecases'

class CacheStoreSpy implements CacheStore {
  insertCallsCount: number = 0
  deleteCallsCount: number = 0
  deleteKey: string
  insertKey: string

  async delete(key: string): Promise<void> {
    this.deleteCallsCount += 1
    this.deleteKey = key
  }
  async insert(key: string): Promise<void> {
    this.insertCallsCount += 1
    this.insertKey = key
  }
}

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

    await sut.save()

    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchaces')
  })
  it('Should not insert new Cache if delete fails', () => {
    const { cacheStore, sut } = makeSut()

    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.save()).rejects.toThrow()
    expect(cacheStore.insertCallsCount).toBe(0)
  })
  it('Should insert new Cache if delete succeeds', async () => {
    const { cacheStore, sut } = makeSut()

    await sut.save()

    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('purchases')
  })
})
