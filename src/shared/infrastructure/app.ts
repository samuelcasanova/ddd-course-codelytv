import express from 'express'
import { json } from 'body-parser'
import { errorHandler } from './errorHandler'
import { VideoRouter } from '../../video/infrastructure/VideoRouter'
import type { CommandBus } from '../domain/CommandBus'
import type { VideoRepository } from '../../video/domain/VideoRepository'
import type { EventBus } from '../domain/EventBus'

export class App {
  private readonly app: express.Express

  constructor (videoRepository: VideoRepository, commandBus: CommandBus, eventBus: EventBus) {
    this.app = express()
    this.app.use(json())
    this.app.use('/api/videos', new VideoRouter(videoRepository, commandBus, eventBus).getRouter())
    this.app.use(errorHandler)
  }

  getExpressApp (): express.Express {
    return this.app
  }

  listen (port: number): void {
    this.app.listen(port, () => {
      console.log(`Http server started and listening on port ${port}`)
    })
  }
}
