import type { Command } from '../../shared/domain/Command'

export class UpdateVideoScoreCommand implements Command {
  name = 'UpdateVideoScoreCommand'
  constructor (public readonly videoId: string, public readonly rating: number) {
  }
}
