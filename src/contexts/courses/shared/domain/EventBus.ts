import { type Event } from './Event'

export interface EventSubscriber<EventType extends Event> {
  eventName: string
  handle: (event: EventType) => Promise<void>
}

export interface EventBus {
  publish: (event: Event) => Promise<void>
  publishAll: (events: Event[]) => Promise<void>
}
