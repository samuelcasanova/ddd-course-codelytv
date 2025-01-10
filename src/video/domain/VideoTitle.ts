import { VideoTitleTooShortError } from './VideoTitleTooShortError'

export class VideoTitle {
  constructor (public readonly value: string) {
    if (this.value.length < 3) {
      throw new VideoTitleTooShortError()
    }
  }
}
