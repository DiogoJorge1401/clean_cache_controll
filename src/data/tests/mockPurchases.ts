import { SavePurchases } from '../../domain/usecases'
import faker from '@faker-js/faker'
export const mockPurchases = (): Array<SavePurchases.Params> => [
  {
    id: faker.random.uuid(),
    date: faker.date.recent(),
    value: +faker.commerce.price(),
  },
  {
    id: faker.random.uuid(),
    date: faker.date.recent(),
    value: +faker.commerce.price(),
  },
]
