import EventEmitter from 'events'
import { type Event } from '../domain/Event'
import { type EventBus, type EventSubscriber } from '../domain/EventBus'

export class EventEmitterEventBus implements EventBus {
  private readonly eventEmitter: EventEmitter = new EventEmitter()

  subscribe (eventSubscriber: EventSubscriber<Event<unknown>>): void {
    this.eventEmitter.on(eventSubscriber.eventName, eventSubscriber.handle.bind(eventSubscriber) as (event: Event<unknown>) => void)
  }

  publish (event: Event<unknown>): void {
    this.eventEmitter.emit(event.name, event)
  }

  publishAll (events: Array<Event<unknown>>): void {
    events.forEach(event => { this.publish(event) })
  }
}
