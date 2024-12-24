import { type Request, type Response } from 'express'
import { SearchAllVideosQueryHandler } from '../application/SearchAllVideosQueryHandler'
import type { VideoRepository } from '../domain/VideoRepository'
import type { CommandBus } from '../../shared/domain/CommandBus'

export class GetVideoController {
  constructor (private readonly videoRepository: VideoRepository, private readonly commandBus: CommandBus) {}
  async handle (req: Request, res: Response): Promise<void> {
    const searchAllVideosQueryHandler = new SearchAllVideosQueryHandler(this.videoRepository)

    const videos = await searchAllVideosQueryHandler.handle()

    res.send(videos.map(video => video.toPrimitives()))
  }
}
