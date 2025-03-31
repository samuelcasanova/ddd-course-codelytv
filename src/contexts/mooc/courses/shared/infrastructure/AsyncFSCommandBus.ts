import { writeFileSync } from 'fs'
import type { Command } from '../domain/Command'
import type { CommandBus } from '../domain/CommandBus'
import type { CommandHandler } from '../domain/CommandHandler'
import path from 'path'

export class AsyncFSCommandBus implements CommandBus {
  subscribe (handlers: Array<CommandHandler<Command>>): void {
    console.warn('AsyncFSCommandBus does not support registering handlers')
  }

  async dispatch (command: Command): Promise<void> {
    const fileName = `command-${command.name}-${new Date().toISOString()}.json`
    const filePath = path.join(__dirname, '..', '..', 'data', 'commands', fileName)
    writeFileSync(filePath, JSON.stringify(command))
  }
}
