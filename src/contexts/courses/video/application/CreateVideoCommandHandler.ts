import type { CommandHandler } from '../../shared/domain/CommandHandler'
import type { EventBus } from '../../shared/domain/EventBus'
import { Id } from '../../shared/domain/Id'
import { Video } from '../domain/Video'
import { VideoFinder } from '../domain/VideoFinder'
import { type VideoRepository } from '../domain/VideoRepository'
import { VideoTitle } from '../domain/VideoTitle'
import { CreateVideoCommand } from './CreateVideoCommand'
import { VideoAlreadyExistsError } from './VideoAlreadyExistsError'

export class CreateVideoCommandHandler implements CommandHandler<CreateVideoCommand> {
  constructor (private readonly repository: VideoRepository, private readonly eventBus: EventBus) { }

  subscribedTo = CreateVideoCommand.name

  async handle (command: CreateVideoCommand): Promise<void> {
    const videoFinder = new VideoFinder(this.repository)
    const id = new Id(command.id)
    const existingVideo = await videoFinder.search(id)
    if (existingVideo !== null) {
      throw new VideoAlreadyExistsError(id)
    }
    const video = Video.create(new Id(command.id), new VideoTitle(command.title))
    await this.repository.save(video)
    const events = video.pullDomainEvents()
    await this.eventBus.publishAll(events)
  }
}
