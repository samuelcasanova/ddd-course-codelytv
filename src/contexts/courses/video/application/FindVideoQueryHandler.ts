import type { FindVideoQuery } from '../../shared/application/FindVideoQuery'
import type { VideoResponse } from '../../shared/application/VideoResponse'
import { Id } from '../../shared/domain/Id'
import type { QueryHandler } from '../../shared/domain/QueryHandler'
import { type VideoRepository } from '../domain/VideoRepository'
import { VideoResponseMapper } from './VideoResponseMapper'

export class FindVideoQueryHandler implements QueryHandler<FindVideoQuery, VideoResponse> {
  constructor (private readonly repository: VideoRepository) { }

  subscribedTo = 'FindVideoQuery'

  async ask (query: FindVideoQuery): Promise<VideoResponse> {
    const video = await this.repository.find(new Id(query.id))
    const mapper = new VideoResponseMapper()
    return mapper.fromEntity(video)
  }
}
