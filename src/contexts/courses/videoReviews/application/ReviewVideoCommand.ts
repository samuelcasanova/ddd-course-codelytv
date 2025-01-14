import type { Command } from '../../shared/domain/Command'
import type { Id } from '../../shared/domain/Id'
import type { Rating } from '../domain/Rating'
import type { Comment } from '../domain/Comment'

export class ReviewVideoCommand implements Command {
  name = 'ReviewVideoCommand'
  constructor (public videoId: Id, public rating: Rating, public comment: Comment) {
  }
}
