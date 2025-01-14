import { type Event } from '../domain/Event'
import { type EventBus } from '../domain/EventBus'

export class FakeRabbitMqEventBus implements EventBus {
  publish (event: Event): void {
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
