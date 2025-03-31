import type { QueryHandler } from '../../shared/domain/QueryHandler'
import { type VideoRepository } from '../domain/VideoRepository'
import type { SearchAllVideosQuery } from './SearchAllVideosQuery'
import { VideoResponseMapper } from './VideoResponseMapper'
import type { VideosResponse } from './VideosResponse'

export class SearchAllVideosQueryHandler implements QueryHandler<SearchAllVideosQuery, VideosResponse> {
  constructor (private readonly repository: VideoRepository) { }

  subscribedTo = 'SearchAllVideosQuery'

  async ask (_query: SearchAllVideosQuery): Promise<VideosResponse> {
    const videos = await this.repository.searchAll()
    const mapper = new VideoResponseMapper()
    return mapper.fromEntities(videos)
  }
}
