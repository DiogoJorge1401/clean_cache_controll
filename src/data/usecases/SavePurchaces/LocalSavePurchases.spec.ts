import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usecases'
import { SavePurchases } from '@/domain'

class CacheStoreSpy implements CacheStore {
  insertCallsCount: number = 0
  deleteCallsCount: number = 0
  deleteKey: string
  insertKey: string
  insertValues: Array<SavePurchases.Params> = []

  async delete(key: string): Promise<void> {
    this.deleteCallsCount += 1
    this.deleteKey = key
  }
  async insert(key: string, values: any): Promise<void> {
    this.insertCallsCount += 1
    this.insertKey = key
    this.insertValues = values
  }
  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })
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

const mockPurchases = (): Array<SavePurchases.Params> => [
  {
    id: '1',
    date: new Date(),
    value: 50,
  },
  {
    id: '2',
    date: new Date(),
    value: 90,
  },
]

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
})
