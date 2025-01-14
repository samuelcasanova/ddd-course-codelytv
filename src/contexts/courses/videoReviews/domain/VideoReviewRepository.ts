import type { VideoReview } from './VideoReview'

export interface VideoReviewRepository {
  save: (video: VideoReview) => Promise<void>
  searchAll: () => Promise<VideoReview[]>
}
