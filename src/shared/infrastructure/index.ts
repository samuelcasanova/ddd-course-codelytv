import { CreateVideoCommandHandler } from '../../video/application/CreateVideoCommandHandler'
import { SQLiteVideoRepository } from '../../video/infrastructure/SQLiteVideoRepository'
import { App } from './app'
import { EventEmitterEventBus } from './EventEmitterEventBus'
import { InMemoryCommandBus } from './InMemoryCommandBus'

async function startServer (): Promise<void> {
  const app = await getApp()
  app.listen(process.env.PORT === undefined ? 3000 : +process.env.PORT)
}

export async function getApp (): Promise<App> {
  const eventBus = new EventEmitterEventBus()
  const videoRepository = await SQLiteVideoRepository.getInstance()
  const commandBus = new InMemoryCommandBus()
  commandBus.register(new CreateVideoCommandHandler(videoRepository, eventBus))
  const app = new App(videoRepository, commandBus, eventBus)
  return app
}

startServer().then(() => {}).catch(console.error)
