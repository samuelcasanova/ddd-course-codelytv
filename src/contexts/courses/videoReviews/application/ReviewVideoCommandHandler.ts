import type { CommandHandler } from '../../shared/domain/CommandHandler'
import type { EventBus } from '../../shared/domain/EventBus'
import { Id } from '../../shared/domain/Id'
import { Rating } from '../domain/Rating'
import { Comment } from '../domain/Comment'
import { VideoReview } from '../domain/VideoReview'
import type { VideoReviewRepository } from '../domain/VideoReviewRepository'
import { ReviewVideoCommand } from './ReviewVideoCommand'
import type { QueryBus } from '../../shared/domain/QueryBus'
import { FindVideoQuery } from '../../shared/application/FindVideoQuery'
import type { VideoResponse } from '../../shared/application/VideoResponse'

export class ReviewVideoCommandHandler implements CommandHandler<ReviewVideoCommand> {
  constructor (private readonly repository: VideoReviewRepository, private readonly eventBus: EventBus, private readonly queryBus: QueryBus) { }

  subscribedTo (): string {
    return ReviewVideoCommand.name
  }

  async handle (command: ReviewVideoCommand): Promise<void> {
    await this.queryBus.ask<VideoResponse>(new FindVideoQuery(command.videoId))
    const videoReview = VideoReview.create(new Id(command.id), new Id(command.videoId), new Rating(command.rating), new Comment(command.comment))
    await this.repository.save(videoReview)
    const events = videoReview.pullDomainEvents()
    await this.eventBus.publishAll(events)
  }
}
