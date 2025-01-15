import { randomInt } from 'crypto'
import { Video } from '../../src/contexts/courses/video/domain/Video'
import { VideoTitle } from '../../src/contexts/courses/video/domain/VideoTitle'
import { Id } from '../../src/contexts/courses/shared/domain/Id'

export class VideoMother {
  static random (): Video {
    return Video.create(new Id(), new VideoTitle(`Hello world ${randomInt(100)}`))
  }
}
