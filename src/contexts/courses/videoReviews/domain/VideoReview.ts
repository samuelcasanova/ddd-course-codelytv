import { Entity } from '../../shared/domain/Entity'
import { Id } from '../../shared/domain/Id'
import { Rating } from './Rating'
import { Comment } from './Comment'
import { VideoReviewCreatedEvent } from '../../shared/domain/events/VideoReviewCreatedEvent'

export interface VideoReviewPrimitives {
  id: string
  videoId: string
  rating: number
  comment: string
}

export class VideoReview extends Entity<Id> {
  private constructor (id: Id, public readonly videoId: Id, public readonly rating: Rating, public readonly comment: Comment) {
    super(id)
  }

  public static create (id: Id, videoId: Id, rating: Rating, comment: Comment): VideoReview {
    const videoReview = new VideoReview(id, videoId, rating, comment)
    const event = new VideoReviewCreatedEvent(videoReview.toPrimitives())
    videoReview.pushDomainEvent(event)
    return videoReview
  }

  public static fromPrimitives (primitives: VideoReviewPrimitives): VideoReview {
    return new VideoReview(new Id(primitives.id), new Id(primitives.videoId), new Rating(primitives.rating), new Comment(primitives.comment))
  }

  public toPrimitives (): VideoReviewPrimitives {
    return {
      id: this.id.value,
      videoId: this.videoId.value,
      rating: this.rating.value,
      comment: this.comment.value
    }
  }
}
