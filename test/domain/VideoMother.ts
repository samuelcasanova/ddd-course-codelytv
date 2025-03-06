import { randomInt } from 'crypto'
import { Video, type VideoPrimitives } from '../../src/contexts/courses/video/domain/Video'
import { VideoTitle } from '../../src/contexts/courses/video/domain/VideoTitle'
import { Id } from '../../src/contexts/courses/shared/domain/Id'

export class VideoMother {
  static create (params?: Partial<VideoPrimitives>): Video {
    return Video.create(new Id(params?.id), new VideoTitle(params?.title ?? `Hello world ${randomInt(100)}`))
  }

  scored (score: number): Video {
    const video = VideoMother.create({
      score: {
        rating: score,
        reviews: 1
      }
    })
    return video
  }
}
