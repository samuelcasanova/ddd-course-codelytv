import type { QueryHandler } from '../../shared/domain/QueryHandler'
import type { VideoReviewRepository } from '../domain/VideoReviewRepository'
import type { SearchAllVideoReviewsQuery } from './SearchAllVideoReviewsQuery'
import { VideoReviewsResponseMapper } from './VideoReviewResponseMapper'
import type { VideoReviewsResponse } from './VideoReviewsResponse'

export class SearchAllVideoReviewsQueryHandler implements QueryHandler<SearchAllVideoReviewsQuery, VideoReviewsResponse> {
  constructor (private readonly repository: VideoReviewRepository) { }

  subscribedTo = 'SearchAllVideoReviewsQuery'

  async ask (_query: SearchAllVideoReviewsQuery): Promise<VideoReviewsResponse> {
    const videoReviews = await this.repository.searchAll()
    const mapper = new VideoReviewsResponseMapper()
    return mapper.fromEntities(videoReviews)
  }
}
