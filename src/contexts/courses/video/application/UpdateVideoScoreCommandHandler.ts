import type { CommandHandler } from '../../shared/domain/CommandHandler'
import type { EventBus } from '../../shared/domain/EventBus'
import { Id } from '../../shared/domain/Id'
import { Rating } from '../../videoReviews/domain/Rating'
import { type VideoRepository } from '../domain/VideoRepository'
import { UpdateVideoScoreCommand } from './UpdateVideoScoreCommand'

export class UpdateVideoScoreCommandHandler implements CommandHandler<UpdateVideoScoreCommand> {
  constructor (private readonly repository: VideoRepository, private readonly eventBus: EventBus) { }

  subscribedTo (): string {
    return UpdateVideoScoreCommand.name
  }

  async handle (command: UpdateVideoScoreCommand): Promise<void> {
    const video = await this.repository.find(new Id(command.videoId))
    video.review(new Rating(command.rating))
    await this.repository.save(video)
    const events = video.pullDomainEvents()
    this.eventBus.publishAll(events)
  }
}
