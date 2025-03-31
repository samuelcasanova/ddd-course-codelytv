
export class CommentTooShortError extends Error {
  constructor () {
    super('Video review comment should be at least 10 characters long')
  }
}
