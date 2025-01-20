import type { Id } from '../../shared/domain/Id'
import { type Video } from './Video'

export interface VideoRepository {
  find: (id: Id) => Promise<Video>
  save: (video: Video) => Promise<void>
  search: (id: Id) => Promise<Video | null>
  searchAll: () => Promise<Video[]>
}
