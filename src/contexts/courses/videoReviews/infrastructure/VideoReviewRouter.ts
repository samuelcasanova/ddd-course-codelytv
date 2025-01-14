import express from 'express'
import type { CommandBus } from '../../shared/domain/CommandBus'
import type { QueryBus } from '../../shared/domain/QueryBus'
import { PostVideoReviewController } from './PostVideoReviewController'

export class VideoReviewRouter {
  constructor (private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
  getRouter (): express.Router {
    const videoReviewRouter = express.Router()
    // const getVideoController = new GetVideoController(this.queryBus)
    const postVideoReviewController = new PostVideoReviewController(this.commandBus)

    // videoReviewRouter.get('/', getVideoController.handle.bind(getVideoController))
    videoReviewRouter.post('/', postVideoReviewController.handle.bind(postVideoReviewController))

    return videoReviewRouter
  }
}
