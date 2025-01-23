import { type Event } from '../Event'

export interface VideoUpdatedPayload {
  id: string
  title: string
  score: {
    reviews: number
    rating: number
  }
}

export class VideoUpdatedEvent implements Event<VideoUpdatedPayload> {
  public readonly name = 'VideoUpdatedEvent'
  public readonly created = new Date()
  constructor (public readonly payload: VideoUpdatedPayload) { }
}
