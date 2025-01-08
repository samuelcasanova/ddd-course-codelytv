import { type Event } from '../domain/Event'
import { type EventBus } from '../domain/EventBus'

export class FakeRabbitMqEventBus implements EventBus {
  publish (event: Event): void {
    console.log(`Publishing event ${event.name}:`, JSON.stringify(event, null, 2))
  }

  publishAll (events: Event[]): void {
    events.forEach(event => { this.publish(event) })
  }
}
