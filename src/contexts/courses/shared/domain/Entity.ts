import { type Event } from './Event'

export abstract class Entity<EntityId> {
  domainEvents: Event[] = []
  pullDomainEvents (): Event[] {
    return this.domainEvents
  }

  pushDomainEvent (event: Event): void {
    this.domainEvents.push(event)
  }

  constructor (public readonly id: EntityId) { }
}
