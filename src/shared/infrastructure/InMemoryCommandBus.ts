import type { Command } from '../domain/Command'
import type { CommandBus } from '../domain/CommandBus'
import type { CommandHandler } from '../domain/CommandHandler'

export class InMemoryCommandBus implements CommandBus {
  private readonly handlers: Array<CommandHandler<Command>> = []
  register<T extends Command> (handler: CommandHandler<T>): void {
    this.handlers.push(handler as CommandHandler<Command>)
  }

  async dispatch (command: Command): Promise<void> {
    const handler = this.handlers.find(handler => handler.subscribedTo() === command.name)
    if (handler === undefined) {
      throw new Error(`Command ${command.name} not found`)
    }
    await handler.handle(command)
  }
}
