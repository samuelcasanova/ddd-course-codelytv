import express from 'express'
import type { CommandBus } from '../../../../contexts/courses/shared/domain/CommandBus'
import type { QueryBus } from '../../../../contexts/courses/shared/domain/QueryBus'
import { PostVideoReviewController } from '../controllers/PostVideoReviewController'
import { GetVideoReviewsController } from '../controllers/GetVideoReviewsController'
import { type Router } from '../../Router'

export default class VideoReviewRouter implements Router {
  constructor (private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
  path = '/api/videos'
  getRouter (): express.Router {
    const videoReviewRouter = express.Router()
    const getVideoReviewsController = new GetVideoReviewsController(this.queryBus)
    const postVideoReviewController = new PostVideoReviewController(this.commandBus)

    videoReviewRouter.get('/:videoId/reviews', getVideoReviewsController.handle.bind(getVideoReviewsController))
    videoReviewRouter.post('/:videoId/reviews', postVideoReviewController.handle.bind(postVideoReviewController))

    return videoReviewRouter
  }
}
