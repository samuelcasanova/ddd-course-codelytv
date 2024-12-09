import { type VideoRepository } from '../../src/video/domain/VideoRepository'
import { type EventBus } from '../../src/shared/domain/EventBus'
import { CreateVideoCommand } from '../../src/video/application/CreateVideoCommand'
import { CreateVideoCommandHandler } from '../../src/video/application/CreateVideoCommandHandler'

const videoIdValue = '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'
const videoTitleValue = 'Hello world'

const repository: VideoRepository = {
  save: jest.fn(),
  searchAll: jest.fn()
}

const eventBus: EventBus = {
  publish: jest.fn(),
  publishAll: jest.fn()
}

describe('Video', () => {
  it('should create a video from value objects', async () => {
    const createVideoCommand = new CreateVideoCommand(videoIdValue, videoTitleValue)

    const handler = new CreateVideoCommandHandler(repository, eventBus)
    await handler.handle(createVideoCommand)

    expect(repository.save).toHaveBeenCalled()
    expect(eventBus.publishAll).toHaveBeenCalled()
  })
})
