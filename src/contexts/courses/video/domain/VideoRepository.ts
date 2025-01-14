import { type Video } from './Video'

export interface VideoRepository {
  save: (video: Video) => Promise<void>
  searchAll: () => Promise<Video[]>
}
