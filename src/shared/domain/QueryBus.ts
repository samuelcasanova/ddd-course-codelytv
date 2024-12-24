import type { Query } from './Query'
import type { QueryHandler } from './QueryHandler'

export interface QueryBus {
  register: <Q extends Query>(handler: QueryHandler<Q>) => void
  ask: <T>(query: Query) => Promise<T>
}
