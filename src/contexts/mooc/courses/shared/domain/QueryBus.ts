import type { Query } from './Query'
import type { QueryHandler } from './QueryHandler'

export interface QueryBus {
  subscribe: (handlers: Array<QueryHandler<Query, unknown>>) => void
  ask: <T>(query: Query) => Promise<T>
}
