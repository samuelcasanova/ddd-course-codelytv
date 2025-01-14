import { type Event } from '../../shared/domain/Event'
import type { VideoReviewPrimitives } from './VideoReview'

export class VideoReviewCreatedEvent implements Event {
  public readonly name = 'VideoReviewCreatedEvent'
  public readonly created = new Date()
  constructor (public readonly payload: VideoReviewPrimitives) { }
}
