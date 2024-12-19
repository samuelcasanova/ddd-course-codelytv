import { type Request, type Response } from 'express'
import { SearchAllVideosQueryHandler } from '../application/SearchAllVideosQueryHandler'
import { SQLiteVideoRepository } from './SQLiteVideoRepository'

export async function getVideoController (req: Request, res: Response): Promise<void> {
  const repository = await SQLiteVideoRepository.create()
  const searchAllVideosQueryHandler = new SearchAllVideosQueryHandler(repository)

  const videos = await searchAllVideosQueryHandler.handle()

  res.send(videos.map(video => video.toPrimitives()))
}
