import { type Event } from '../Event'

export const VIDEO_REVIEW_CREATED_EVENT_NAME = 'VideoReviewCreatedEvent'

export interface VideoReviewCreatedPayload {
  id: string
  videoId: string
  rating: number
  comment: string
}

export class VideoReviewCreatedEvent implements Event<VideoReviewCreatedPayload> {
  public readonly name: string = VIDEO_REVIEW_CREATED_EVENT_NAME
  public readonly created = new Date()
  constructor (public readonly payload: VideoReviewCreatedPayload) { }
}
