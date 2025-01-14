import { randomInt } from 'crypto'
import { Video } from '../../src/contexts/courses/video/domain/Video'
import { VideoTitle } from '../../src/contexts/courses/video/domain/VideoTitle'

export class VideoMother {
  static random (): Video {
    return Video.create(new VideoTitle(`Hello world ${randomInt(100)}`))
  }
}
