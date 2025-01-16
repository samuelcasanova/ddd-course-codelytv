import { type Event } from '../domain/Event'
import { type EventBus, type EventSubscriber } from '../domain/EventBus'

export class FakeRabbitMqEventBus implements EventBus {
  private readonly subscribers: Record<EventSubscriber<Event>['eventName'], [EventSubscriber<Event>['handle']]> = {}

  subscribe (eventSubscriber: EventSubscriber<Event>): void {
    this.subscribers[eventSubscriber.eventName].push(eventSubscriber.handle.bind(eventSubscriber))
  }

  async publish (event: Event): Promise<void> {
    const subscribersHandlers = this.subscribers[event.name]
    if (subscribersHandlers?.length > 0) {
      await Promise.all(subscribersHandlers.map(async (handler) => { await handler(event) }))
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

  async publishAll (events: Event[]): Promise<void> {
    await Promise.all(events.map(async (event) => { await this.publish(event) }))
  }
}
