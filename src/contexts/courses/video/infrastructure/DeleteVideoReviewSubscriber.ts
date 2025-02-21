import type { CommandBus } from '../../shared/domain/CommandBus'
import type { EventSubscriber } from '../../shared/domain/EventBus'
import { VideoReviewDeletedEvent } from '../../shared/domain/events/VideoReviewDeletedEvent'
import { NotFoundError } from '../../shared/infrastructure/NotFoundError'
import { AdjustVideoScoreCommand } from '../application/AdjustVideoScoreCommand'

export class DeleteVideoReviewSubscriber implements EventSubscriber<VideoReviewDeletedEvent> {
  eventName = VideoReviewDeletedEvent.name

  constructor (private readonly commandBus: CommandBus) {
  }

  async handle (event: VideoReviewDeletedEvent): Promise<void> {
    const adjustVideoScoreCommand = new AdjustVideoScoreCommand(event.payload.videoId, event.payload.rating, event.payload.id)

    try {
      await this.commandBus.dispatch(adjustVideoScoreCommand)
    } catch (error) {
      if (error instanceof NotFoundError) {
        console.info('In VideoReviewCommandHandler, video not found, skipping as probably the message has arrived before the creation of the video')
      } else {
        throw error
      }
    }
  }
}
