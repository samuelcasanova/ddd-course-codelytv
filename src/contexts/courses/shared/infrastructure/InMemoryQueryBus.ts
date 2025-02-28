import type { Query } from '../domain/Query'
import type { QueryBus } from '../domain/QueryBus'
import type { QueryHandler } from '../domain/QueryHandler'

export class InMemoryQueryBus implements QueryBus {
  private readonly handlers: Record<QueryHandler<Query, unknown>['subscribedTo'], QueryHandler<Query, unknown>> = {}

  subscribe (handlers: Array<QueryHandler<Query, unknown>>): void {
    handlers.forEach(handler => {
      this.handlers[handler.subscribedTo] = handler
    })
  }

  async ask <T>(query: Query): Promise<T> {
    const handler = this.handlers[query.name]
    if (handler === undefined) {
      throw new Error(`Query ${query.name} not found`)
    }
    return await handler.ask(query) as T
  }
}
