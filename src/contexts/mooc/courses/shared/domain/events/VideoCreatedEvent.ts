import { type Event } from '../Event'

export interface VideoCreatedPayload {
  id: string
  title: string
}

export class VideoCreatedEvent implements Event<VideoCreatedPayload> {
  public readonly name = 'VideoCreatedEvent'
  public readonly created = new Date()
  constructor (public readonly payload: VideoCreatedPayload) { }
}
