import type { CommandHandler } from '../../shared/domain/CommandHandler'
import type { EventBus } from '../../shared/domain/EventBus'
import { Id } from '../../shared/domain/Id'
import type { QueryBus } from '../../shared/domain/QueryBus'
import { SearchAllVideoReviewsQuery } from '../../videoReviews/application/SearchAllVideoReviewsQuery'
import { SearchVideoReviewsForaVideoQuery } from '../../videoReviews/application/SearchVideoReviewsForaVideoQuery'
import { SearchVideoReviewsForaVideoQueryHandler } from '../../videoReviews/application/SearchVideoReviewsForaVideoQueryHandler'
import type { VideoReviewsResponse } from '../../videoReviews/application/VideoReviewsResponse'
import { Rating } from '../../videoReviews/domain/Rating'
import { VideoFinder } from '../domain/VideoFinder'
import { type VideoRepository } from '../domain/VideoRepository'
import { UpdateVideoScoreCommand } from './UpdateVideoScoreCommand'

export class UpdateVideoScoreCommandHandler implements CommandHandler<UpdateVideoScoreCommand> {
  constructor (private readonly repository: VideoRepository, private readonly eventBus: EventBus, private readonly queryBus: QueryBus) { }

  subscribedTo (): string {
    return UpdateVideoScoreCommand.name
  }

  async handle (command: UpdateVideoScoreCommand): Promise<void> {
    const videoFinder = new VideoFinder(this.repository)
    const video = await videoFinder.find(new Id(command.videoId))
    const videoReviews = await this.queryBus.ask<VideoReviewsResponse>(new SearchVideoReviewsForaVideoQuery(command.videoId))
    videoReviews.videoReviews.forEach(review => { video.review(new Rating(review.rating)) })
    await this.repository.save(video)
    const events = video.pullDomainEvents()
    this.eventBus.publishAll(events)
  }
}
