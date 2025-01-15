import { type Event } from '../domain/Event'
import { type EventBus } from '../domain/EventBus'

export class FakeRabbitMqEventBus implements EventBus {
  private readonly subscribers: Record<string, [(event: Event) => void]> = {}

  subscribe (eventName: string, handler: (event: Event) => void): void {
    this.subscribers[eventName].push(handler)
  }

  publish (event: Event): void {
    const subscribers = this.subscribers[event.name]
    if (subscribers?.length > 0) {
      subscribers.forEach(subscriber => { subscriber(event) })
    }

    const { created, ...data } = event
    const jsonApiFormattedEvent = {
      data,
      meta: {
        created
      }
    }
    console.log(`Publishing event ${event.name}:`, JSON.stringify(jsonApiFormattedEvent, null, 2))
  }

  publishAll (events: Event[]): void {
    events.forEach(event => { this.publish(event) })
  }
}
