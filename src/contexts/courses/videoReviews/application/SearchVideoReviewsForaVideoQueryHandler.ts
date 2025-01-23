import type { QueryHandler } from '../../shared/domain/QueryHandler'
import type { VideoReviewRepository } from '../domain/VideoReviewRepository'
import type { SearchVideoReviewsForaVideoQuery } from './SearchVideoReviewsForaVideoQuery'
import { VideoReviewsResponseMapper } from './VideoReviewResponseMapper'
import type { VideoReviewsResponse } from './VideoReviewsResponse'

export class SearchVideoReviewsForaVideoQueryHandler implements QueryHandler<SearchVideoReviewsForaVideoQuery, VideoReviewsResponse> {
  constructor (private readonly repository: VideoReviewRepository) { }

  subscribedTo (): string {
    return 'SearchVideoReviewsForaVideoQuery'
  }

  async ask (query: SearchVideoReviewsForaVideoQuery): Promise<VideoReviewsResponse> {
    const videoReviews = await this.repository.searchByVideoId(query.videoId)
    const mapper = new VideoReviewsResponseMapper()
    return mapper.fromEntities(videoReviews)
  }
}
