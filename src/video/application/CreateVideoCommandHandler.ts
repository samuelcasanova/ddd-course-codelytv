import type { CommandHandler } from '../../shared/domain/CommandHandler'
import type { EventBus } from '../../shared/domain/EventBus'
import { Video } from '../domain/Video'
import { type VideoRepository } from '../domain/VideoRepository'
import { CreateVideoCommand } from './CreateVideoCommand'

export class CreateVideoCommandHandler implements CommandHandler<CreateVideoCommand> {
  constructor (private readonly repository: VideoRepository, private readonly eventBus: EventBus) { }

  subscribedTo (): string {
    return CreateVideoCommand.name
  }

  async handle (command: CreateVideoCommand): Promise<void> {
    const video = Video.fromPrimitives(command.id, command.title)
    await this.repository.save(video)
    const events = video.pullDomainEvents()
    this.eventBus.publishAll(events)
  }
}
