import { type Event } from './Event'

export interface EventSubscriber<EventType extends Event> {
  eventName: string
  handle: (event: EventType) => Promise<void>
}

export interface EventBus {
  subscribe: (eventSubscriber: EventSubscriber<Event>) => void
  publish: (event: Event) => void
  publishAll: (events: Event[]) => void
}
