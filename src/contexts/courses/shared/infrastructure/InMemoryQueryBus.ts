import type { Query } from '../domain/Query'
import type { QueryBus } from '../domain/QueryBus'
import type { QueryHandler } from '../domain/QueryHandler'

export class InMemoryQueryBus implements QueryBus {
  private readonly handlers: Array<QueryHandler<Query, unknown>> = []
  register <Q extends Query, T>(handler: QueryHandler<Q, T>): void {
    this.handlers.push(handler as QueryHandler<Query, T>)
  }

  async ask <T>(query: Query): Promise<T> {
    const handler = this.handlers.find(handler => handler.subscribedTo() === query.name)
    if (handler === undefined) {
      throw new Error(`Query ${query.name} not found`)
    }
    return await handler.ask(query) as T
  }
}
