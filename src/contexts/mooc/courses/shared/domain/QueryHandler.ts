import type { Query } from './Query'

export interface QueryHandler<Q extends Query, T> {
  subscribedTo: string
  ask: (query: Q) => Promise<T>
}
