import EventEmitter from 'events'
import { type Event } from '../domain/Event'
import { type EventBus } from '../domain/EventBus'

export class EventEmitterEventBus implements EventBus {
  private readonly eventEmitter: EventEmitter = new EventEmitter()

  publish (event: Event): void {
    this.eventEmitter.emit(event.name, event)
  }

  publishAll (events: Event[]): void {
    events.forEach(event => { this.publish(event) })
  }
}
