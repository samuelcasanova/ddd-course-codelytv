import { VideoId } from './VideoId'
import { VideoTitle } from './VideoTitle'

export class Video {
  constructor (public readonly id: VideoId, public readonly title: VideoTitle) { }
  public static create (id: VideoId, title: VideoTitle): Video {
    return new Video(id, title)
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
