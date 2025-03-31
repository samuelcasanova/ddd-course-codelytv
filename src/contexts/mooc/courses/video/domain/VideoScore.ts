import { Rating } from '../../videoReviews/domain/Rating'
import { VideoReviews } from '../../videoReviews/domain/VideoReviews'

export interface VideoScorePrimitives {
  reviews: number
  rating: number
}

export class VideoScore {
  private constructor (public readonly reviews: VideoReviews, public readonly rating: Rating) {}

  static create (): VideoScore {
    return new VideoScore(new VideoReviews(), new Rating())
  }

  addReview (rating: Rating): VideoScore {
    const newReviews = this.reviews.increase()
    const newRating = new Rating((this.rating.value * this.reviews.value + rating.value) / newReviews.value)
    return new VideoScore(newReviews, newRating)
  }

  deleteReview (rating: Rating): VideoScore {
    const newReviews = this.reviews.decrease()
    const newRating = new Rating((this.rating.value * this.reviews.value - rating.value) / (this.reviews.value - 1))
    return new VideoScore(newReviews, newRating)
  }

  toPrimitives (): VideoScorePrimitives {
    return {
      reviews: this.reviews.value,
      rating: this.rating.value
    }
  }

  static fromPrimitives (primitives: VideoScorePrimitives): VideoScore {
    return new VideoScore(new VideoReviews(primitives.reviews), new Rating(primitives.rating))
  }
}
