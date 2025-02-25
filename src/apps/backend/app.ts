/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import { glob } from 'glob'

import type { QueryBus } from '../../contexts/courses/shared/domain/QueryBus'
import type { CommandBus } from '../../contexts/courses/shared/domain/CommandBus'
import { errorHandler } from '../../contexts/courses/shared/infrastructure/errorHandler'
import { InMemoryCommandBus } from '../../contexts/courses/shared/infrastructure/InMemoryCommandBus'
import { InMemoryQueryBus } from '../../contexts/courses/shared/infrastructure/InMemoryQueryBus'
import { FakeRabbitMqEventBus } from '../../contexts/courses/shared/infrastructure/FakeRabbitMqEventBus'

import { SearchAllVideosQueryHandler } from '../../contexts/courses/video/application/SearchAllVideosQueryHandler'
import { CreateVideoCommandHandler } from '../../contexts/courses/video/application/CreateVideoCommandHandler'
import { UpdateVideoScoreCommandHandler } from '../../contexts/courses/video/application/UpdateVideoScoreCommandHandler'
import { SQLiteVideoRepository } from '../../contexts/courses/video/infrastructure/SQLiteVideoRepository'
import { ReviewVideoSubscriber } from '../../contexts/courses/video/infrastructure/ReviewVideoSubscriber'

import { ReviewVideoCommandHandler } from '../../contexts/courses/videoReviews/application/ReviewVideoCommandHandler'
import { SearchAllVideoReviewsQueryHandler } from '../../contexts/courses/videoReviews/application/SearchAllVideoReviewsQueryHandler'
import { SQLiteVideoReviewRepository } from '../../contexts/courses/videoReviews/infrastructure/SQLiteVideoReviewRepository'
import { SearchVideoReviewsForaVideoQueryHandler } from '../../contexts/courses/videoReviews/application/SearchVideoReviewsForaVideoQueryHandler'
import { FindVideoQueryHandler } from '../../contexts/courses/video/application/FindVideoQueryHandler'
import type { EventBus } from '../../contexts/courses/shared/domain/EventBus'
import { InMemoryCacheRepository } from '../../contexts/courses/shared/infrastructure/InMemoryCacheRepository'
import type { CacheRepository } from '../../contexts/courses/shared/domain/CacheRepository'
import { AdjustVideoScoreCommandHandler } from '../../contexts/courses/video/application/AdjustVideoScoreCommandHandler'
import { DeleteVideoReviewSubscriber } from '../../contexts/courses/video/infrastructure/DeleteVideoReviewSubscriber'
import path from 'path'
import type { Router } from './Router'

export class App {
  private static app: App
  private readonly expressApp: express.Express

  private constructor (public readonly commandBus: CommandBus, public readonly queryBus: QueryBus, public readonly eventBus: EventBus, public readonly cache: CacheRepository) {
    this.expressApp = express()
    this.expressApp.use(json())

    this.registerRouters()

    this.expressApp.use(errorHandler)
  }

  registerRouters (): void {
    const routers = glob.sync(path.join(__dirname, '**/routers/*Router.ts'))
    routers.forEach((router) => {
      const RouterClass = require(router).default
      const routerInstance = new RouterClass(this.commandBus, this.queryBus) as Router
      this.expressApp.use(routerInstance.path, routerInstance.getRouter())
    })
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
