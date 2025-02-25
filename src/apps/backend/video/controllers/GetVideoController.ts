import { type Request, type Response } from 'express'
import type { QueryBus } from '../../../../contexts/courses/shared/domain/QueryBus'
import { SearchAllVideosQuery } from '../../../../contexts/courses/video/application/SearchAllVideosQuery'
import type { VideosResponse } from '../../../../contexts/courses/video/application/VideosResponse'

export class GetVideoController {
  constructor (private readonly queryBus: QueryBus) {}
  async handle (req: Request, res: Response): Promise<void> {
    const searchAllVideosQuery = new SearchAllVideosQuery()

    const { videos } = await this.queryBus.ask<VideosResponse>(searchAllVideosQuery)

    res.send(videos)
  }
}
