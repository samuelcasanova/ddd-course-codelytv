import { type Request, type Response } from 'express'
import type { QueryBus } from '../../shared/domain/QueryBus'
import { SearchAllVideoReviewsQuery } from '../application/SearchAllVideoReviewsQuery'
import type { VideoReviewsResponse } from '../application/VideoReviewsResponse'

export class GetVideoReviewsController {
  constructor (private readonly queryBus: QueryBus) { }
  async handle (req: Request, res: Response): Promise<void> {
    const searchAllVideoReviewsQuery = new SearchAllVideoReviewsQuery()

    const { videoReviews } = await this.queryBus.ask<VideoReviewsResponse>(searchAllVideoReviewsQuery)

    res.status(200).send(videoReviews)
  }
}
