/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import { glob } from 'glob'

import type { QueryBus } from '../../contexts/courses/shared/domain/QueryBus'
import type { CommandBus } from '../../contexts/courses/shared/domain/CommandBus'
import { errorHandler } from '../../contexts/courses/shared/infrastructure/errorHandler'

import { SearchAllVideosQueryHandler } from '../../contexts/courses/video/application/SearchAllVideosQueryHandler'
import { type CreateVideoCommandHandler } from '../../contexts/courses/video/application/CreateVideoCommandHandler'
import { type UpdateVideoScoreCommandHandler } from '../../contexts/courses/video/application/UpdateVideoScoreCommandHandler'
import { type SQLiteVideoRepository } from '../../contexts/courses/video/infrastructure/SQLiteVideoRepository'

import { type ReviewVideoCommandHandler } from '../../contexts/courses/videoReviews/application/ReviewVideoCommandHandler'
import { SearchAllVideoReviewsQueryHandler } from '../../contexts/courses/videoReviews/application/SearchAllVideoReviewsQueryHandler'
import { type SQLiteVideoReviewRepository } from '../../contexts/courses/videoReviews/infrastructure/SQLiteVideoReviewRepository'
import { SearchVideoReviewsForaVideoQueryHandler } from '../../contexts/courses/videoReviews/application/SearchVideoReviewsForaVideoQueryHandler'
import { FindVideoQueryHandler } from '../../contexts/courses/video/application/FindVideoQueryHandler'
import type { EventBus } from '../../contexts/courses/shared/domain/EventBus'
import { type InMemoryCacheRepository } from '../../contexts/courses/shared/infrastructure/InMemoryCacheRepository'
import type { CacheRepository } from '../../contexts/courses/shared/domain/CacheRepository'
import { type AdjustVideoScoreCommandHandler } from '../../contexts/courses/video/application/AdjustVideoScoreCommandHandler'
import path from 'path'
import type { Router } from './Router'
import { Container, ids } from './dependencyInjection/Container'

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
    const eventBus = await Container.get<EventBus>(ids.shared.eventBus)
    const commandBus = await Container.get<CommandBus>(ids.shared.commandBus)
    const queryBus = await Container.get<QueryBus>(ids.shared.queryBus)

    const videoRepository = await Container.get<SQLiteVideoRepository>(ids.video.videoRepository)
    await videoRepository.init()

    const videoReviewRepository = await Container.get<SQLiteVideoReviewRepository>(ids.videoReview.videoReviewRepository)
    await videoReviewRepository.init()

    const cacheRepository = await Container.get<InMemoryCacheRepository>(ids.shared.cacheRepository)

    // commandBus.register(await Container.get<CreateVideoCommandHandler>(ids.video.createVideoCommandHandler))
    // commandBus.register(await Container.get<UpdateVideoScoreCommandHandler>(ids.video.updateVideoScoreCommandHandler))
    // commandBus.register(await Container.get<ReviewVideoCommandHandler>(ids.videoReview.reviewVideoCommandHandler))
    // commandBus.register(await Container.get<AdjustVideoScoreCommandHandler>(ids.video.adjustVideoScoreCommandHandler))

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
