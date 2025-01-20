import type { CommandBus } from '../../shared/domain/CommandBus'
import type { EventSubscriber } from '../../shared/domain/EventBus'
import { VideoReviewCreatedEvent } from '../../shared/domain/events/VideoReviewCreatedEvent'
import { UpdateVideoScoreCommand } from '../application/UpdateVideoScoreCommand'

export class ReviewVideoSubscriber implements EventSubscriber<VideoReviewCreatedEvent> {
  eventName = VideoReviewCreatedEvent.name

  constructor (private readonly commandBus: CommandBus) {
  }

  async handle (event: VideoReviewCreatedEvent): Promise<void> {
    const updateVideoRatingCommand = new UpdateVideoScoreCommand(event.payload.videoId, event.payload.rating)

    await this.commandBus.dispatch(updateVideoRatingCommand)
  }
}
