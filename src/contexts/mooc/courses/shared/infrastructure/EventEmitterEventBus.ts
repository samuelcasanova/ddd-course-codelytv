import EventEmitter from 'events'
import { type Event } from '../domain/Event'
import { type EventBus, type EventSubscriber } from '../domain/EventBus'

export class EventEmitterEventBus implements EventBus {
  private readonly eventEmitter: EventEmitter = new EventEmitter()

  subscribe (eventSubscribers: Array<EventSubscriber<Event<unknown>>>): void {
    eventSubscribers.forEach(eventSubscriber => {
      this.eventEmitter.on(eventSubscriber.eventName, eventSubscriber.handle.bind(eventSubscriber) as (event: Event<unknown>) => void)
    })
  }

  async publish (event: Event<unknown>): Promise<void> {
    this.eventEmitter.emit(event.name, event)
  }

  async publishAll (events: Array<Event<unknown>>): Promise<void> {
    await Promise.all(events.map(async (event) => { await this.publish(event) }))
  }
}
