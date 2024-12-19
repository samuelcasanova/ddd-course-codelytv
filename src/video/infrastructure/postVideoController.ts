import { type Request, type Response } from 'express'
import { eventBus } from '../../shared/infrastructure/eventEmitterEventBus'
import { CreateVideoCommand } from '../application/CreateVideoCommand'
import { CreateVideoCommandHandler } from '../application/CreateVideoCommandHandler'
import { SQLiteVideoRepository } from './SQLiteVideoRepository'

export async function postVideoController (req: Request, res: Response): Promise<void> {
  const repository = await SQLiteVideoRepository.create()
  const createVideoCommand = new CreateVideoCommand(req.body.id, req.body.title)
  const createVideoCommandHandler = new CreateVideoCommandHandler(repository, eventBus)

  await createVideoCommandHandler.handle(createVideoCommand)

  res.status(201).send()
}
