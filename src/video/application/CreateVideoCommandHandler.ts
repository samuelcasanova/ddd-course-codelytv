import type { EventBus } from '../../shared/domain/EventBus'
import { Video } from '../domain/Video'
import { type VideoRepository } from '../domain/VideoRepository'
import { type CreateVideoCommand } from './CreateVideoCommand'

export class CreateVideoCommandHandler {
  constructor (private readonly repository: VideoRepository, private readonly eventBus: EventBus) { }

  async handle (command: CreateVideoCommand): Promise<void> {
    const video = Video.fromPrimitives(command.id, command.title)
    await this.repository.save(video)
    const events = video.pullDomainEvents()
    this.eventBus.publishAll(events)
  }
}
