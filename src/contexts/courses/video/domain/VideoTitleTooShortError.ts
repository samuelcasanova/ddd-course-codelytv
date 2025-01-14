export class VideoTitleTooShortError extends Error {
  constructor () {
    super('Video title should be at least 3 characters long')
  }
}
