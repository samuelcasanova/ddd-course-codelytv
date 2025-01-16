export class VideoReviewsOutOfRangeError extends Error {
  constructor () {
    super('Video reviews should be greater than zero')
  }
}
