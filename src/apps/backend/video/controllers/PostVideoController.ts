import { type Request, type Response } from 'express'
import { CreateVideoCommand } from '../../../../contexts/courses/video/application/CreateVideoCommand'
import type { CommandBus } from '../../../../contexts/courses/shared/domain/CommandBus'

export class PostVideoController {
  constructor (private readonly commandBus: CommandBus) { }
  async handle (req: Request, res: Response): Promise<void> {
    const createVideoCommand = new CreateVideoCommand(req.body.id, req.body.title)

    await this.commandBus.dispatch(createVideoCommand)

    res.status(201).send()
  }
}
