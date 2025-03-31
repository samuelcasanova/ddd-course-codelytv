import { type Event } from '../Event'

export const VIDEO_REVIEW_DELETED_EVENT_NAME = 'VideoReviewDeletedEvent'

export interface VideoReviewDeletedPayload {
  id: string
  videoId: string
  rating: number
  comment: string
}

export class VideoReviewDeletedEvent implements Event<VideoReviewDeletedPayload> {
  public readonly name: string = VIDEO_REVIEW_DELETED_EVENT_NAME
  public readonly created = new Date()
  constructor (public readonly payload: VideoReviewDeletedPayload) { }
}
