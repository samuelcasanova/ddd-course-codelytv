import type { Command } from '../domain/Command'
import type { CommandBus } from '../domain/CommandBus'
import type { CommandHandler } from '../domain/CommandHandler'

export class InMemoryCommandBus implements CommandBus {
  private readonly handlers: Record<CommandHandler<Command>['subscribedTo'], CommandHandler<Command>> = {}

  async subscribe (handlers: Array<CommandHandler<Command>>): Promise<void> {
    handlers.forEach((handler) => {
      this.handlers[handler.subscribedTo] = handler
    })
  }

  async dispatch (command: Command): Promise<void> {
    const handler = this.handlers[command.name]
    if (handler === undefined) {
      throw new Error(`Command ${command.name} not found`)
    }
    await handler.handle(command)
  }
}
