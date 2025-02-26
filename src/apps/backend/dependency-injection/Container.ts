import { ContainerBuilder, YamlFileLoader } from 'node-dependency-injection'
import path from 'path'

export const ids = {
  shared: {
    eventBus: 'shared.eventBus',
    commandBus: 'shared.commandBus',
    queryBus: 'shared.queryBus'
  },
  videoReview: {
    reviewVideoSubscriber: 'videoReview.reviewVideoSubscriber',
    deleteVideoReviewSubscriber: 'videoReview.deleteVideoReviewSubscriber'
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
