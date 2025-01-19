import express from 'express'
import type { CommandBus } from '../../shared/domain/CommandBus'
import type { QueryBus } from '../../shared/domain/QueryBus'
import { PostVideoReviewController } from './PostVideoReviewController'
import { GetVideoReviewsController } from './GetVideoReviewsController'

export class VideoReviewRouter {
  constructor (private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
  getRouter (): express.Router {
    const videoReviewRouter = express.Router()
    const getVideoReviewsController = new GetVideoReviewsController(this.queryBus)
    const postVideoReviewController = new PostVideoReviewController(this.commandBus)

    videoReviewRouter.get('/:videoId/reviews', getVideoReviewsController.handle.bind(getVideoReviewsController))
    videoReviewRouter.post('/:videoId/reviews', postVideoReviewController.handle.bind(postVideoReviewController))

    return videoReviewRouter
  }
}
