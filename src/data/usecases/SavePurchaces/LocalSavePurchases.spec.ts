import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usecases'

class CacheStoreSpy implements CacheStore {
  insertCallsCount: number = 0
  deleteCallsCount: number = 0
  key: string

  async delete(key: string): Promise<void> {
    this.deleteCallsCount += 1
    this.key = key
  }

  async insert(): Promise<void> {
    this.insertCallsCount += 1
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
    expect(cacheStore.key).toBe('purchaces')
  })
  it('Should not insert new Cache if delete fails', async () => {
    const { cacheStore, sut } = makeSut()

    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.save()).rejects.toThrow()
    expect(cacheStore.insertCallsCount).toBe(0)
  })
  it('Should insert new Cache if delete succeeds', async () => {
    const { cacheStore, sut } = makeSut()
    sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertCallsCount).toBe(1)
  })
})
