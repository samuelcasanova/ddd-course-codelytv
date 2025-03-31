import { type VideoRepository } from './VideoRepository'
import type { Id } from '../../shared/domain/Id'
import type { Video } from './Video'

export class VideoFinder {
  constructor (private readonly repository: VideoRepository) { }

  async find (id: Id): Promise<Video> {
    const video = await this.repository.find(id)
    return video
  }

  async search (id: Id): Promise<Video | null> {
    const video = await this.repository.search(id)
    return video
  }
}
