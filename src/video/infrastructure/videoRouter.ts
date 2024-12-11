import express, { type Request, type Response } from 'express'
import { SQLiteVideoRepository } from './SQLiteVideoRepository'
import { SearchAllVideosQueryHandler } from '../application/SearchAllVideosQueryHandler'
import { CreateVideoCommand } from '../application/CreateVideoCommand'
import { CreateVideoCommandHandler } from '../application/CreateVideoCommandHandler'
import { eventBus } from '../../shared/infrastructure/eventEmitterEventBus'

export const videoRouter = express.Router()

videoRouter.get(
  '/',
  async (req: Request, res: Response) => {
    const repository = await SQLiteVideoRepository.create()
    const searchAllVideosQueryHandler = new SearchAllVideosQueryHandler(repository)

    const videos = await searchAllVideosQueryHandler.handle()

    res.send(videos.map(video => video.toPrimitives()))
  }
)

videoRouter.post('/', async (req: Request, res: Response) => {
  const repository = await SQLiteVideoRepository.create()
  const createVideoCommand = new CreateVideoCommand(req.body.id, req.body.title)
  const createVideoCommandHandler = new CreateVideoCommandHandler(repository, eventBus)

  await createVideoCommandHandler.handle(createVideoCommand)

  res.status(201).send()
})
