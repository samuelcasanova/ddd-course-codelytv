import express from 'express'
import { GetVideoController } from '../controllers/GetVideoController'
import { PostVideoController } from '../controllers/PostVideoController'
import type { CommandBus } from '../../../../../contexts/mooc/courses/shared/domain/CommandBus'
import type { QueryBus } from '../../../../../contexts/mooc/courses/shared/domain/QueryBus'
import type { Router } from '../../Router'

export default class VideoRouter implements Router {
  path = '/api/videos'
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
