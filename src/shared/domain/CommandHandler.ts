import type { Command } from './Command'

export interface CommandHandler<T extends Command> {
  subscribedTo: () => string
  handle: (command: T) => Promise<void>
}
