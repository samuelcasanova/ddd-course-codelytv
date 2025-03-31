import type { VideoReview } from '../domain/VideoReview'
import type { VideoReviewsResponse } from './VideoReviewsResponse'

export class VideoReviewsResponseMapper {
  fromEntities (videoReviews: VideoReview[]): VideoReviewsResponse {
    return {
      videoReviews: videoReviews.map(r => ({
        id: r.id.value,
        videoId: r.videoId.value,
        rating: r.rating.value,
        comment: r.comment.value
      }))
    }
  }
}
