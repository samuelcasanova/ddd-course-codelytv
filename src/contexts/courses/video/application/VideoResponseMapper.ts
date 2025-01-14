import type { Video } from '../domain/Video';
import type { VideosResponse } from './VideosResponse';


export class VideoResponseMapper {
  fromEntities(videos: Video[]): VideosResponse {
    return {
      videos: videos.map(video => ({
        id: video.id.value,
        title: video.title.value
      }))
    };
  }
}
