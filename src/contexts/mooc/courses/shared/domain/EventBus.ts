import { type Event } from './Event'

export interface EventSubscriber<EventType extends Event<unknown>> {
  eventName: string
  handle: (event: EventType) => Promise<void>
}

export interface EventBus {
  subscribe: (eventSubscribers: Array<EventSubscriber<Event<unknown>>>) => void
  publish: (event: Event<unknown>) => Promise<void>
  publishAll: (events: Array<Event<unknown>>) => Promise<void>
}
