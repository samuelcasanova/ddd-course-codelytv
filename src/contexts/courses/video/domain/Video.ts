import { VideoCreatedEvent } from './VideoCreatedEvent'
import { Id } from '../../shared/domain/Id'
import { VideoTitle } from './VideoTitle'
import { Entity } from '../../shared/domain/Entity'

export interface VideoPrimitives {
  id: string
  title: string
}

export class Video extends Entity<Id> {
  private constructor (id: Id, public readonly title: VideoTitle) {
    super(id)
  }

  public static create (title: VideoTitle, id?: Id): Video {
    const videoId = id ?? new Id()
    const video = new Video(videoId, title)
    const event = new VideoCreatedEvent(video.toPrimitives())
    video.pushDomainEvent(event)
    return video
  }

  public static fromPrimitives (primitives: VideoPrimitives): Video {
    return Video.create(new VideoTitle(primitives.title), new Id(primitives.id))
  }

  public toPrimitives (): VideoPrimitives {
    return {
      id: this.id.value,
      title: this.title.value
    }
  }
}
