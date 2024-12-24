import express from 'express'
import { json } from 'body-parser'
import { errorHandler } from './errorHandler'
import { VideoRouter } from '../../video/infrastructure/VideoRouter'
import type { CommandBus } from '../domain/CommandBus'
import type { QueryBus } from '../domain/QueryBus'
import { CreateVideoCommandHandler } from '../../video/application/CreateVideoCommandHandler'
import { SearchAllVideosQueryHandler } from '../../video/application/SearchAllVideosQueryHandler'
import { SQLiteVideoRepository } from '../../video/infrastructure/SQLiteVideoRepository'
import { EventEmitterEventBus } from './EventEmitterEventBus'
import { InMemoryCommandBus } from './InMemoryCommandBus'
import { InMemoryQueryBus } from './InMemoryQueryBus'

export class App {
  private readonly expressApp: express.Express
  private static app: App

  private constructor (commandBus: CommandBus, queryBus: QueryBus) {
    this.expressApp = express()
    this.expressApp.use(json())
    this.expressApp.use('/api/videos', new VideoRouter(commandBus, queryBus).getRouter())
    this.expressApp.use(errorHandler)
  }

  getExpressApp (): express.Express {
    return this.expressApp
  }

  static async getInstance (): Promise<App> {
    if (App.app !== undefined) {
      return App.app
    }
    const eventBus = new EventEmitterEventBus()
    const videoRepository = await SQLiteVideoRepository.getInstance()
    const commandBus = new InMemoryCommandBus()
    commandBus.register(new CreateVideoCommandHandler(videoRepository, eventBus))
    const queryBus = new InMemoryQueryBus()
    queryBus.register(new SearchAllVideosQueryHandler(videoRepository))
    App.app = new App(commandBus, queryBus)
    return App.app
  }

  listen (port: number): void {
    this.expressApp.listen(port, () => {
      console.log(`Http server started and listening on port ${port}`)
    })
  }
}
