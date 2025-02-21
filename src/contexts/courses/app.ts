import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'

import type { QueryBus } from './shared/domain/QueryBus'
import type { CommandBus } from './shared/domain/CommandBus'
import { errorHandler } from './shared/infrastructure/errorHandler'
import { InMemoryCommandBus } from './shared/infrastructure/InMemoryCommandBus'
import { InMemoryQueryBus } from './shared/infrastructure/InMemoryQueryBus'
import { FakeRabbitMqEventBus } from './shared/infrastructure/FakeRabbitMqEventBus'

import { SearchAllVideosQueryHandler } from './video/application/SearchAllVideosQueryHandler'
import { CreateVideoCommandHandler } from './video/application/CreateVideoCommandHandler'
import { UpdateVideoScoreCommandHandler } from './video/application/UpdateVideoScoreCommandHandler'
import { VideoRouter } from './video/infrastructure/VideoRouter'
import { SQLiteVideoRepository } from './video/infrastructure/SQLiteVideoRepository'
import { ReviewVideoSubscriber } from './video/infrastructure/ReviewVideoSubscriber'

import { ReviewVideoCommandHandler } from './videoReviews/application/ReviewVideoCommandHandler'
import { SearchAllVideoReviewsQueryHandler } from './videoReviews/application/SearchAllVideoReviewsQueryHandler'
import { SQLiteVideoReviewRepository } from './videoReviews/infrastructure/SQLiteVideoReviewRepository'
import { VideoReviewRouter } from './videoReviews/infrastructure/VideoReviewRouter'
import { SearchVideoReviewsForaVideoQueryHandler } from './videoReviews/application/SearchVideoReviewsForaVideoQueryHandler'
import { FindVideoQueryHandler } from './video/application/FindVideoQueryHandler'
import type { EventBus } from './shared/domain/EventBus'
import { InMemoryCacheRepository } from './shared/infrastructure/InMemoryCacheRepository'
import type { CacheRepository } from './shared/domain/CacheRepository'
import { AdjustVideoScoreCommandHandler } from './video/application/AdjustVideoScoreCommandHandler'
import { DeleteVideoReviewSubscriber } from './video/infrastructure/DeleteVideoReviewSubscriber'

export class App {
  private static app: App
  private readonly expressApp: express.Express

  private constructor (public readonly commandBus: CommandBus, public readonly queryBus: QueryBus, public readonly eventBus: EventBus, public readonly cache: CacheRepository) {
    this.expressApp = express()
    this.expressApp.use(json())
    this.expressApp.use('/api/videos', new VideoRouter(commandBus, queryBus).getRouter())
    this.expressApp.use('/api/videos', new VideoReviewRouter(commandBus, queryBus).getRouter())
    this.expressApp.use(errorHandler)
  }

  getExpressApp (): express.Express {
    return this.expressApp
  }

  static async getInstance (): Promise<App> {
    if (App.app !== undefined) {
      return App.app
    }
    const eventBus = new FakeRabbitMqEventBus()
    const commandBus = new InMemoryCommandBus()
    const queryBus = new InMemoryQueryBus()

    const videoRepository = await SQLiteVideoRepository.getInstance()
    const videoReviewRepository = await SQLiteVideoReviewRepository.getInstance()
    const cacheRepository = new InMemoryCacheRepository()

    eventBus.subscribe(new ReviewVideoSubscriber(commandBus))
    eventBus.subscribe(new DeleteVideoReviewSubscriber(commandBus))

    commandBus.register(new CreateVideoCommandHandler(videoRepository, eventBus))
    commandBus.register(new UpdateVideoScoreCommandHandler(videoRepository, eventBus, cacheRepository))
    commandBus.register(new ReviewVideoCommandHandler(videoReviewRepository, eventBus, queryBus))
    commandBus.register(new AdjustVideoScoreCommandHandler(videoRepository, eventBus, cacheRepository))

    queryBus.register(new SearchAllVideosQueryHandler(videoRepository))
    queryBus.register(new SearchAllVideoReviewsQueryHandler(videoReviewRepository))
    queryBus.register(new SearchVideoReviewsForaVideoQueryHandler(videoReviewRepository))
    queryBus.register(new FindVideoQueryHandler(videoRepository))

    App.app = new App(commandBus, queryBus, eventBus, cacheRepository)
    return App.app
  }

  listen (port: number): void {
    this.expressApp.listen(port, () => {
      console.log(`Http server started and listening on port ${port}`)
    })
  }
}
