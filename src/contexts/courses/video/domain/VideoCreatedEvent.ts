import { type Event } from '../../shared/domain/Event'
import type { VideoPrimitives } from './Video'

export class VideoCreatedEvent implements Event<VideoPrimitives> {
  public readonly name = 'VideoCreatedEvent'
  public readonly created = new Date()
  constructor (public readonly payload: VideoPrimitives) { }
}
