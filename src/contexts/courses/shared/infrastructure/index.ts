import { App } from './app'

async function startServer (): Promise<void> {
  const app = await App.getInstance()
  app.listen(process.env.PORT === undefined ? 3000 : +process.env.PORT)
}

startServer().then(() => {}).catch(console.error)
