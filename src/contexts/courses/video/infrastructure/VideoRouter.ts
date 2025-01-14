import express from 'express'
import { GetVideoController } from './GetVideoController'
import { PostVideoController } from './PostVideoController'
import type { CommandBus } from '../../shared/domain/CommandBus'
import type { QueryBus } from '../../shared/domain/QueryBus'

export class VideoRouter {
  constructor (private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
  getRouter (): express.Router {
    const videoRouter = express.Router()
    const getVideoController = new GetVideoController(this.queryBus)
    const postVideoController = new PostVideoController(this.commandBus)

    videoRouter.get('/', getVideoController.handle.bind(getVideoController))
    videoRouter.post('/', postVideoController.handle.bind(postVideoController))

    return videoRouter
  }
}
