import { type Video } from '../domain/Video'
import { type VideoRepository } from '../domain/VideoRepository'

export class SearchAllVideosQueryHandler {
  constructor (private readonly repository: VideoRepository) { }
  async handle (): Promise<Video[]> {
    return await this.repository.searchAll()
  }
}
