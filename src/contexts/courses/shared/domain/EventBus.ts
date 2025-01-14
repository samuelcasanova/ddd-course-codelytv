import { type Event } from './Event'

export interface EventBus {
  publish: (event: Event) => void
  publishAll: (events: Event[]) => void
}
