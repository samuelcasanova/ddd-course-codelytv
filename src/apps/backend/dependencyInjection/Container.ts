import { ContainerBuilder, YamlFileLoader } from 'node-dependency-injection'
import path from 'path'
import { SQLiteVideoRepository } from '../../../contexts/courses/video/infrastructure/SQLiteVideoRepository'
import { SQLiteVideoReviewRepository } from '../../../contexts/courses/videoReviews/infrastructure/SQLiteVideoReviewRepository'

export const ids = {
  shared: {
    eventBus: 'shared.eventBus',
    commandBus: 'shared.commandBus',
    queryBus: 'shared.queryBus',
    cacheRepository: 'shared.cacheRepository'
  },
  videoReview: {
    videoReviewRepository: 'videoReview.videoReviewRepository',
    reviewVideoSubscriber: 'videoReview.reviewVideoSubscriber',
    deleteVideoReviewSubscriber: 'videoReview.deleteVideoReviewSubscriber',
    reviewVideoCommandHandler: 'videoReview.reviewVideoCommandHandler'
  },
  video: {
    videoRepository: 'video.videoRepository',
    createVideoCommandHandler: 'video.createVideoCommandHandler',
    updateVideoScoreCommandHandler: 'video.updateVideoScoreCommandHandler',
    adjustVideoScoreCommandHandler: 'video.adjustVideoScoreCommandHandler'
  }
}

export class Container {
  private static container: ContainerBuilder
  static async get<T>(id: string): Promise<T> {
    if (this.container === undefined) {
      this.container = new ContainerBuilder()
      const loader = new YamlFileLoader(this.container)
      await loader.load(path.join(__dirname, 'application.yaml'))
    }

    return this.container.get<T>(id)
  }
}
