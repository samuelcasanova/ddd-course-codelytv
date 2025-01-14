import type { CommandHandler } from '../../shared/domain/CommandHandler'
import type { EventBus } from '../../shared/domain/EventBus'
import { CreateVideoCommand } from '../../video/application/CreateVideoCommand'
import { VideoReview } from '../domain/VideoReview'
import type { VideoReviewRepository } from '../domain/VideoReviewRepository'
import type { ReviewVideoCommand } from './ReviewVideoCommand'

export class ReviewVideoCommandHandler implements CommandHandler<ReviewVideoCommand> {
  constructor (private readonly repository: VideoReviewRepository, private readonly eventBus: EventBus) { }

  subscribedTo (): string {
    return CreateVideoCommand.name
  }

  async handle (command: ReviewVideoCommand): Promise<void> {
    const videoReview = VideoReview.create(command.videoId, command.rating, command.comment)
    await this.repository.save(videoReview)
    const events = videoReview.pullDomainEvents()
    this.eventBus.publishAll(events)
  }
}
