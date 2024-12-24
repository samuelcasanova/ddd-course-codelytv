import { randomInt } from 'crypto'
import { Video } from '../../src/video/domain/Video'
import { VideoTitle } from '../../src/video/domain/VideoTitle'
import { VideoId } from '../../src/video/domain/VideoId'

export class VideoMother {
  static random (): Video {
    return new Video(new VideoId(), new VideoTitle(`Hello world ${randomInt(100)}`))
  }
}
