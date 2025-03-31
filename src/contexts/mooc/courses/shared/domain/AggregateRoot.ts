import { type Event } from './Event'

export abstract class AggregateRoot<AggregateRootId> {
  domainEvents: Array<Event<unknown>> = []
  pullDomainEvents (): Array<Event<unknown>> {
    return this.domainEvents
  }

  pushDomainEvent (event: Event<unknown>): void {
    this.domainEvents.push(event)
  }

  constructor (public readonly id: AggregateRootId) { }
}
