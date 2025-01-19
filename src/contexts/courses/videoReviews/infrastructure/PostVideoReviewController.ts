import { type Request, type Response } from 'express'
import type { CommandBus } from '../../shared/domain/CommandBus'
import { ReviewVideoCommand } from '../application/ReviewVideoCommand'

export async function postVideoController (req: Request, res: Response): Promise<void> {
}

export class PostVideoReviewController {
  constructor (private readonly commandBus: CommandBus) { }
  async handle (req: Request, res: Response): Promise<void> {
    const reviewVideoCommand = new ReviewVideoCommand(req.body.id, req.params.videoId, req.body.rating, req.body.comment)

    await this.commandBus.dispatch(reviewVideoCommand)

    res.status(201).send()
  }
}
