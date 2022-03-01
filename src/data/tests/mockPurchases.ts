import { SavePurchases } from '../../domain/usecases'
import faker from '@faker-js/faker'
export const mockPurchases = (): Array<SavePurchases.Params> => [
  {
    id: '_id' + (Math.random() * 1000 + 1),
    date: faker.date.recent(),
    value: +faker.commerce.price(),
  },
  {
    id: '_id' + (Math.random() * 1000 + 1),
    date: faker.date.recent(),
    value: +faker.commerce.price(),
  },
]
