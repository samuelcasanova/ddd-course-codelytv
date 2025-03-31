import type { Command } from '../../shared/domain/Command'

export class AdjustVideoScoreCommand implements Command {
  name = 'AdjustVideoScoreCommand'
  constructor (public readonly videoId: string, public readonly rating: number, public deletedVideoReviewId: string) {
  }
}
