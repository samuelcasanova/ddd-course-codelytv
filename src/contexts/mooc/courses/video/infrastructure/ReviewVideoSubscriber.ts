import type { CommandBus } from '../../shared/domain/CommandBus'
import type { EventSubscriber } from '../../shared/domain/EventBus'
import { VideoReviewCreatedEvent } from '../../shared/domain/events/VideoReviewCreatedEvent'
import { NotFoundError } from '../../shared/infrastructure/NotFoundError'
import { UpdateVideoScoreCommand } from '../application/UpdateVideoScoreCommand'

export class ReviewVideoSubscriber implements EventSubscriber<VideoReviewCreatedEvent> {
  eventName = VideoReviewCreatedEvent.name

  constructor (private readonly commandBus: CommandBus) {
  }

  async handle (event: VideoReviewCreatedEvent): Promise<void> {
    const updateVideoScoreCommand = new UpdateVideoScoreCommand(event.payload.videoId, event.payload.rating, event.payload.id)

    try {
      await this.commandBus.dispatch(updateVideoScoreCommand)
    } catch (error) {
      if (error instanceof NotFoundError) {
        console.info('In VideoReviewCommandHandler, video not found, skipping as probably the review message has arrived before the creation of the video')
      } else {
        throw error
      }
    }
  }
}
