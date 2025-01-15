import { type Event } from './Event'

export interface EventBus {
  subscribe: (eventName: string, handler: (event: Event) => void) => void
  publish: (event: Event) => void
  publishAll: (events: Event[]) => void
}
