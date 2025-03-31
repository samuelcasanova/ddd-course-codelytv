import type { Command } from '../../shared/domain/Command'

export class ReviewVideoCommand implements Command {
  name = 'ReviewVideoCommand'
  constructor (public readonly id: string, public readonly videoId: string, public readonly rating: number, public readonly comment: string) {
  }
}
