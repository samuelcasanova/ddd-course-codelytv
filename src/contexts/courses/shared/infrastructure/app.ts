import express from 'express'
import { json } from 'body-parser'
import { errorHandler } from './errorHandler'
import { VideoRouter } from '../../video/infrastructure/VideoRouter'
import type { CommandBus } from '../domain/CommandBus'
import type { QueryBus } from '../domain/QueryBus'
import { CreateVideoCommandHandler } from '../../video/application/CreateVideoCommandHandler'
import { SearchAllVideosQueryHandler } from '../../video/application/SearchAllVideosQueryHandler'
import { SQLiteVideoRepository } from '../../video/infrastructure/SQLiteVideoRepository'
import { InMemoryCommandBus } from './InMemoryCommandBus'
import { InMemoryQueryBus } from './InMemoryQueryBus'
import { FakeRabbitMqEventBus } from './FakeRabbitMqEventBus'
import { ReviewVideoCommandHandler } from '../../videoReviews/application/ReviewVideoCommandHandler'
import { SQLiteVideoReviewRepository } from '../../videoReviews/infrastructure/SQLiteVideoReviewRepository'
import { VideoReviewRouter } from '../../videoReviews/infrastructure/VideoReviewRouter'
import { SearchAllVideoReviewsQueryHandler } from '../../videoReviews/application/SearchAllVideoReviewsQueryHandler'
import { UpdateVideoScoreCommandHandler } from '../../video/application/UpdateVideoScoreCommandHandler'

export class App {
  private readonly expressApp: express.Express
  private static app: App

  private constructor (commandBus: CommandBus, queryBus: QueryBus) {
    this.expressApp = express()
    this.expressApp.use(json())
    this.expressApp.use('/api/videos', new VideoRouter(commandBus, queryBus).getRouter())
    this.expressApp.use('/api/videos/:videoId/reviews', new VideoReviewRouter(commandBus, queryBus).getRouter())
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
    const videoRepository = await SQLiteVideoRepository.getInstance()
    const videoReviewRepository = await SQLiteVideoReviewRepository.getInstance()
    const commandBus = new InMemoryCommandBus()
    commandBus.register(new CreateVideoCommandHandler(videoRepository, eventBus))
    commandBus.register(new UpdateVideoScoreCommandHandler(videoRepository, eventBus))
    commandBus.register(new ReviewVideoCommandHandler(videoReviewRepository, eventBus))
    const queryBus = new InMemoryQueryBus()
    queryBus.register(new SearchAllVideosQueryHandler(videoRepository))
    queryBus.register(new SearchAllVideoReviewsQueryHandler(videoReviewRepository))
    App.app = new App(commandBus, queryBus)
    return App.app
  }

  listen (port: number): void {
    this.expressApp.listen(port, () => {
      console.log(`Http server started and listening on port ${port}`)
    })
  }
}
