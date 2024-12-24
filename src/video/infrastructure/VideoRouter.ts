import express from 'express'
import { GetVideoController } from './GetVideoController'
import { PostVideoController } from './PostVideoController'
import type { CommandBus } from '../../shared/domain/CommandBus'
import type { VideoRepository } from '../domain/VideoRepository'
import type { EventBus } from '../../shared/domain/EventBus'

export class VideoRouter {
  constructor (private readonly repository: VideoRepository, private readonly commandBus: CommandBus, private readonly eventBus: EventBus) {}
  getRouter (): express.Router {
    const videoRouter = express.Router()
    const getVideoController = new GetVideoController(this.repository, this.commandBus)
    const postVideoController = new PostVideoController(this.commandBus)

    videoRouter.get('/', getVideoController.handle.bind(getVideoController))
    videoRouter.post('/', postVideoController.handle.bind(postVideoController))

    return videoRouter
  }
}
