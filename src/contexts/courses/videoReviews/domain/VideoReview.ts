import { Entity } from '../../shared/domain/Entity'
import { Id } from '../../shared/domain/Id'
import { Rating } from './Rating'
import { Comment } from './Comment'
import { VideoReviewCreatedEvent } from './VideoReviewCreatedEvent'
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

  public static create (videoId: Id, rating: Rating, comment: Comment, id?: Id): VideoReview {
    const videoReviewId = id ?? new Id()
    const videoReview = new VideoReview(videoReviewId, videoId, rating, comment)
    const event = new VideoReviewCreatedEvent(videoReview.toPrimitives())
    videoReview.pushDomainEvent(event)
    return videoReview
  }

  public static fromPrimitives (primitives: VideoReviewPrimitives): VideoReview {
    return VideoReview.create(new Id(primitives.videoId), new Rating(primitives.rating), new Comment(primitives.comment), new Id(primitives.id))
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
