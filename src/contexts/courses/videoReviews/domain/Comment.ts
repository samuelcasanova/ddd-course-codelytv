import { CommentTooShortError } from './CommentTooShortError'

export class Comment {
  constructor (public readonly value: string) {
    if (value.length < 10) {
      throw new CommentTooShortError()
    }
  }
}
