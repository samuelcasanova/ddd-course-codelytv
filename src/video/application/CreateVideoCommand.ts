import type { Command } from '../../shared/domain/Command'

export class CreateVideoCommand implements Command {
  name = 'CreateVideoCommand'
  constructor (public readonly id: string, public readonly title: string) {
  }
}
