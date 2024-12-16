import EventEmitter from 'events'
import { type Event } from '../domain/Event'
import { type EventBus } from '../domain/EventBus'

class EventEmitterEventBus implements EventBus {
  subscribe (arg0: string, arg1: () => void) {
    throw new Error('Method not implemented.')
  }

  private readonly eventEmitter: EventEmitter = new EventEmitter()

  publish (event: Event): void {
    this.eventEmitter.emit(event.name, event)
  }

  publishAll (events: Event[]): void {
    events.forEach(event => { this.publish(event) })
  }
}

export const eventBus = new EventEmitterEventBus()
