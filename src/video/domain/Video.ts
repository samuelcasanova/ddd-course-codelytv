import { VideoCreatedEvent } from './VideoCreatedEvent'
import { VideoId } from './VideoId'
import { VideoTitle } from './VideoTitle'
import { type Event } from '../../shared/domain/Event'

export class Video {
  domainEvents: Event[] = []
  pullDomainEvents (): Event[] {
    return this.domainEvents
  }

  pushDomainEvent (event: Event): void {
    this.domainEvents.push(event)
  }

  constructor (public readonly id: VideoId, public readonly title: VideoTitle) { }
  public static create (id: VideoId, title: VideoTitle): Video {
    const video = new Video(id, title)
    const event = new VideoCreatedEvent(id.value, title.value)
    video.pushDomainEvent(event)
    return video
  }

  public static fromPrimitives (id: string, title: string): Video {
    return Video.create(new VideoId(id), new VideoTitle(title))
  }

  public toPrimitives (): { id: string, title: string } {
    return {
      id: this.id.value,
      title: this.title.value
    }
  }
}
