import { type Event } from './Event'

export interface EventSubscriber<EventType extends Event> {
  eventName: string
  handle: (event: EventType) => Promise<void>
}

export interface EventBus {
  subscribe: (eventSubscribers: Array<EventSubscriber<Event>>) => void
  publish: (event: Event) => Promise<void>
  publishAll: (events: Event[]) => Promise<void>
}
