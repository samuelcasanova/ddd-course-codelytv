import type { VideoResponse } from '../../shared/application/VideoResponse'
import type { Video } from '../domain/Video'
import type { VideosResponse } from './VideosResponse'

export class VideoResponseMapper {
  fromEntities (videos: Video[]): VideosResponse {
    return {
      videos: videos.map(video => (this.fromEntity(video)))
    }
  }

  fromEntity (video: Video): VideoResponse {
    return {
      id: video.id.value,
      title: video.title.value
    }
  }
}
