import type { CacheRepository } from '../../shared/domain/CacheRepository'
import type { CommandHandler } from '../../shared/domain/CommandHandler'
import type { EventBus } from '../../shared/domain/EventBus'
import { Id } from '../../shared/domain/Id'
import { Rating } from '../../videoReviews/domain/Rating'
import { VideoFinder } from '../domain/VideoFinder'
import { type VideoRepository } from '../domain/VideoRepository'
import { AdjustVideoScoreCommand } from './AdjustVideoScoreCommand'

export class AdjustVideoScoreCommandHandler implements CommandHandler<AdjustVideoScoreCommand> {
  constructor (private readonly repository: VideoRepository, private readonly eventBus: EventBus, private readonly cache: CacheRepository) { }

  subscribedTo (): string {
    return AdjustVideoScoreCommand.name
  }

  async handle (command: AdjustVideoScoreCommand): Promise<void> {
    const videoFinder = new VideoFinder(this.repository)
    const video = await videoFinder.find(new Id(command.videoId))
    if (!await this.cache.has(command.deletedVideoReviewId)) {
      return
    }

    video.adjustScore(new Rating(command.rating))
    await this.repository.save(video)

    const events = video.pullDomainEvents()
    await this.eventBus.publishAll(events)

    await this.cache.delete(command.deletedVideoReviewId)
  }
}
