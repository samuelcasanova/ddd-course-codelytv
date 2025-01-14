import type { Command } from './Command'
import type { CommandHandler } from './CommandHandler'

export interface CommandBus {
  register: <T extends Command>(handler: CommandHandler<T>) => void
  dispatch: (command: Command) => Promise<void>
}
