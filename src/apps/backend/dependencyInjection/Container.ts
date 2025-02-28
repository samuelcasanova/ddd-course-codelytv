import { ContainerBuilder, YamlFileLoader } from 'node-dependency-injection'
import path from 'path'

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
    await this.checkInstance()

    return this.container.get<T>(id)
  }

  static async getByTag<T>(tag: string): Promise<T[]> {
    await this.checkInstance()

    const idsIterable = this.container.findTaggedServiceIds(tag)
    const definitions = Array.from(idsIterable)
    const instances = await Promise.all(definitions.map(async (definition) => {
      return this.container.get<T>(definition.id)
    }))

    return instances
  }

  private static async checkInstance (): Promise<void> {
    if (this.container === undefined) {
      this.container = new ContainerBuilder()
      const loader = new YamlFileLoader(this.container)
      await loader.load(path.join(__dirname, 'application.yaml'))
    }
  }
}
