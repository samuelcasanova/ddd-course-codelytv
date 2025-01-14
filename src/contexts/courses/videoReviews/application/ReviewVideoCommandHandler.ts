import type { CommandHandler } from '../../shared/domain/CommandHandler'
import type { EventBus } from '../../shared/domain/EventBus'
import { Id } from '../../shared/domain/Id'
import { Rating } from '../domain/Rating'
import { Comment } from '../domain/Comment'
import { VideoReview } from '../domain/VideoReview'
import type { VideoReviewRepository } from '../domain/VideoReviewRepository'
import { ReviewVideoCommand } from './ReviewVideoCommand'

export class ReviewVideoCommandHandler implements CommandHandler<ReviewVideoCommand> {
  constructor (private readonly repository: VideoReviewRepository, private readonly eventBus: EventBus) { }

  subscribedTo (): string {
    return ReviewVideoCommand.name
  }

  async handle (command: ReviewVideoCommand): Promise<void> {
    const videoReview = VideoReview.create(new Id(command.id), new Id(command.videoId), new Rating(command.rating), new Comment(command.comment))
    await this.repository.save(videoReview)
    const events = videoReview.pullDomainEvents()
    this.eventBus.publishAll(events)
  }
}
