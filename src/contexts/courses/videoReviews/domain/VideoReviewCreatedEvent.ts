import { type Event } from '../../shared/domain/Event'
import type { VideoReviewPrimitives } from './VideoReview'

export const VIDEO_REVIEW_CREATED_EVENT_NAME = 'VideoReviewCreatedEvent'

export class VideoReviewCreatedEvent implements Event<VideoReviewPrimitives> {
  public readonly name: string = VIDEO_REVIEW_CREATED_EVENT_NAME
  public readonly created = new Date()
  constructor (public readonly payload: VideoReviewPrimitives) { }
}
