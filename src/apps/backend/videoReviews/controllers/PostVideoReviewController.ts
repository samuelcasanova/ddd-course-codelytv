import { type Request, type Response } from 'express'
import type { CommandBus } from '../../../../contexts/courses/shared/domain/CommandBus'
import { ReviewVideoCommand } from '../../../../contexts/courses/videoReviews/application/ReviewVideoCommand'

export class PostVideoReviewController {
  constructor (private readonly commandBus: CommandBus) { }
  async handle (req: Request, res: Response): Promise<void> {
    const reviewVideoCommand = new ReviewVideoCommand(req.body.id, req.params.videoId, req.body.rating, req.body.comment)

    await this.commandBus.dispatch(reviewVideoCommand)

    res.status(201).send()
  }
}
