import { VideoReviewsOutOfRangeError } from './VideoReviewsOutOfRangeError'

export class VideoReviews {
  constructor (public readonly value: number = 0) {
    if (this.value < 0) {
      throw new VideoReviewsOutOfRangeError()
    }
  }

  increase (): VideoReviews {
    return new VideoReviews(this.value + 1)
  }

  decrease (): VideoReviews {
    return new VideoReviews(this.value - 1)
  }
}
