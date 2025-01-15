export interface VideoScorePrimitives {
  reviews: number
  rating: number
}

export class VideoScore {
  private constructor (public readonly reviews: number, public readonly rating: number) {}

  static create (): VideoScore {
    return new VideoScore(0, 0)
  }

  addReview (rating: number): VideoScore {
    const newRating = (this.rating * this.reviews + rating) / (this.reviews + 1)
    return new VideoScore(this.reviews + 1, newRating)
  }

  toPrimitives (): VideoScorePrimitives {
    return {
      reviews: this.reviews,
      rating: this.rating
    }
  }

  static fromPrimitives (primitives: VideoScorePrimitives): VideoScore {
    return new VideoScore(primitives.reviews, primitives.rating)
  }
}
