import { type Request, type Response } from 'express'
import type { QueryBus } from '../../../../../contexts/mooc/courses/shared/domain/QueryBus'
import { SearchAllVideoReviewsQuery } from '../../../../../contexts/mooc/courses/videoReviews/application/SearchAllVideoReviewsQuery'
import type { VideoReviewsResponse } from '../../../../../contexts/mooc/courses/videoReviews/application/VideoReviewsResponse'

export class GetVideoReviewsController {
  constructor (private readonly queryBus: QueryBus) { }
  async handle (req: Request, res: Response): Promise<void> {
    const searchAllVideoReviewsQuery = new SearchAllVideoReviewsQuery()

    const { videoReviews } = await this.queryBus.ask<VideoReviewsResponse>(searchAllVideoReviewsQuery)

    res.status(200).send(videoReviews)
  }
}
