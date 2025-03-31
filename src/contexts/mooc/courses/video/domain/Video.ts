import { VideoCreatedEvent } from '../../shared/domain/events/VideoCreatedEvent'
import { Id } from '../../shared/domain/Id'
import { VideoTitle } from './VideoTitle'
import { Entity } from '../../shared/domain/Entity'
import { VideoScore, type VideoScorePrimitives } from './VideoScore'
import type { Rating } from '../../videoReviews/domain/Rating'
import { VideoUpdatedEvent } from '../../shared/domain/events/VideoUpdatedEvent'

export interface VideoPrimitives {
  id: string
  title: string
  score: VideoScorePrimitives
}

export class Video extends Entity<Id> {
  private constructor (id: Id, public readonly title: VideoTitle, public score: VideoScore) {
    super(id)
  }

  public static create (id: Id, title: VideoTitle): Video {
    const video = new Video(id, title, VideoScore.create())
    const event = new VideoCreatedEvent(video.toPrimitives())
    video.pushDomainEvent(event)
    return video
  }

  public review (rating: Rating): void {
    this.score = this.score.addReview(rating)
    const event = new VideoUpdatedEvent(this.toPrimitives())
    this.pushDomainEvent(event)
  }

  public adjustScore (deletedRating: Rating): void {
    this.score = this.score.deleteReview(deletedRating)
    const event = new VideoUpdatedEvent(this.toPrimitives())
    this.pushDomainEvent(event)
  }

  public static fromPrimitives (primitives: VideoPrimitives): Video {
    return new Video(new Id(primitives.id), new VideoTitle(primitives.title), VideoScore.fromPrimitives(primitives.score))
  }

  public toPrimitives (): VideoPrimitives {
    return {
      id: this.id.value,
      title: this.title.value,
      score: this.score.toPrimitives()
    }
  }
}
