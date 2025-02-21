import type { CacheRepository } from '../../shared/domain/CacheRepository'
import type { CommandHandler } from '../../shared/domain/CommandHandler'
import type { EventBus } from '../../shared/domain/EventBus'
import { Id } from '../../shared/domain/Id'
import type { QueryBus } from '../../shared/domain/QueryBus'
import { Rating } from '../../videoReviews/domain/Rating'
import { VideoFinder } from '../domain/VideoFinder'
import { type VideoRepository } from '../domain/VideoRepository'
import { UpdateVideoScoreCommand } from './UpdateVideoScoreCommand'

export class UpdateVideoScoreCommandHandler implements CommandHandler<UpdateVideoScoreCommand> {
  constructor (private readonly repository: VideoRepository, private readonly eventBus: EventBus, private readonly queryBus: QueryBus, private readonly cache: CacheRepository) { }

  subscribedTo (): string {
    return UpdateVideoScoreCommand.name
  }

  async handle (command: UpdateVideoScoreCommand): Promise<void> {
    const videoFinder = new VideoFinder(this.repository)
    const video = await videoFinder.find(new Id(command.videoId))
    if (await this.cache.has(command.videoReviewId)) {
      return
    }
    await this.cache.set(command.videoReviewId, command)
    video.review(new Rating(command.rating))
    await this.repository.save(video)
    const events = video.pullDomainEvents()
    await this.eventBus.publishAll(events)
  }
}
