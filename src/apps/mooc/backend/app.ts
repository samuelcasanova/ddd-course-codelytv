/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import { glob } from 'glob'

import type { QueryBus } from '../../../contexts/mooc/courses/shared/domain/QueryBus'
import type { CommandBus } from '../../../contexts/mooc/courses/shared/domain/CommandBus'
import { errorHandler } from '../../../contexts/mooc/courses/shared/infrastructure/errorHandler'

import { type SQLiteVideoRepository } from '../../../contexts/mooc/courses/video/infrastructure/SQLiteVideoRepository'

import { type SQLiteVideoReviewRepository } from '../../../contexts/mooc/courses/videoReviews/infrastructure/SQLiteVideoReviewRepository'
import type { EventBus, EventSubscriber } from '../../../contexts/mooc/courses/shared/domain/EventBus'
import { type InMemoryCacheRepository } from '../../../contexts/mooc/courses/shared/infrastructure/InMemoryCacheRepository'
import type { CacheRepository } from '../../../contexts/mooc/courses/shared/domain/CacheRepository'
import path from 'path'
import type { Router } from './Router'
import { Container, ids } from './dependencyInjection/Container'
import { type Event } from '../../../contexts/mooc/courses/shared/domain/Event'
import type { CommandHandler } from '../../../contexts/mooc/courses/shared/domain/CommandHandler'
import type { Command } from '../../../contexts/mooc/courses/shared/domain/Command'
import type { Query } from '../../../contexts/mooc/courses/shared/domain/Query'
import type { QueryHandler } from '../../../contexts/mooc/courses/shared/domain/QueryHandler'

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

    const commandBus = await Container.get<CommandBus>(ids.shared.commandBus)
    const commandHandlers = await Container.getByTag<CommandHandler<Command>>('commandHandler')
    commandBus.subscribe(commandHandlers)

    const queryBus = await Container.get<QueryBus>(ids.shared.queryBus)
    const queryHandlers = await Container.getByTag<QueryHandler<Query, unknown>>('queryHandler')
    queryBus.subscribe(queryHandlers)

    const eventBus = await Container.get<EventBus>(ids.shared.eventBus)
    const eventSubscribers = await Container.getByTag<EventSubscriber<Event<unknown>>>('eventSubscriber')
    eventBus.subscribe(eventSubscribers)

    const videoRepository = await Container.get<SQLiteVideoRepository>(ids.video.videoRepository)
    await videoRepository.init()

    const videoReviewRepository = await Container.get<SQLiteVideoReviewRepository>(ids.videoReview.videoReviewRepository)
    await videoReviewRepository.init()

    const cacheRepository = await Container.get<InMemoryCacheRepository>(ids.shared.cacheRepository)

    App.app = new App(commandBus, queryBus, eventBus, cacheRepository)
    return App.app
  }

  listen (port: number): void {
    this.expressApp.listen(port, () => {
      console.log(`Http server started and listening on port ${port}`)
    })
  }
}
