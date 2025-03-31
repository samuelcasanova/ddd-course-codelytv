import { type Event } from '../domain/Event'
import { type EventBus, type EventSubscriber } from '../domain/EventBus'

export class FakeRabbitMqEventBus implements EventBus {
  private readonly subscribers: Record<EventSubscriber<Event<unknown>>['eventName'], Array<EventSubscriber<Event<unknown>>>> = {}

  subscribe (subscribers: Array<EventSubscriber<Event<unknown>>>): void {
    subscribers.forEach((subscriber) => {
      if (this.subscribers[subscriber.eventName] === undefined) {
        this.subscribers[subscriber.eventName] = []
      }
      this.subscribers[subscriber.eventName].push(subscriber)
    })
  }

  async publish (event: Event<unknown>): Promise<void> {
    const subscribersHandlers = this.subscribers[event.name]
    if (subscribersHandlers?.length > 0) {
      await Promise.all(subscribersHandlers.map(async (subscriber) => { await subscriber.handle(event) }))
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

  async publishAll (events: Array<Event<unknown>>): Promise<void> {
    await Promise.all(events.map(async (event) => { await this.publish(event) }))
  }
}
