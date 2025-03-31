import type { Command } from './Command'
import type { CommandHandler } from './CommandHandler'

export interface CommandBus {
  subscribe: (handlers: Array<CommandHandler<Command>>) => void
  dispatch: (command: Command) => Promise<void>
}
