import { CreateVideoCommand } from '../../src/video/application/CreateVideoCommand'
import { CreateVideoCommandHandler } from '../../src/video/application/CreateVideoCommandHandler'
import { VideoCreatedEvent } from '../../src/video/domain/VideoCreatedEvent'
import { Video } from '../../src/video/domain/Video'
import { SearchAllVideosQueryHandler } from '../../src/video/application/SearchAllVideosQueryHandler'

const videoIdValue = '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'
const videoTitleValue = 'Hello world'

const repository = {
  save: jest.fn(),
  searchAll: jest.fn()
}

const eventBus = {
  publish: jest.fn(),
  publishAll: jest.fn()
}

describe('Video', () => {
  it('should create a video from primitives', async () => {
    const createVideoCommand = new CreateVideoCommand(videoIdValue, videoTitleValue)

    const handler = new CreateVideoCommandHandler(repository, eventBus)
    await handler.handle(createVideoCommand)

    expect(repository.save).toHaveBeenCalled()
    expect(eventBus.publishAll.mock.calls[0][0]).toHaveLength(1)
    expect(eventBus.publishAll.mock.calls[0][0][0]).toBeInstanceOf(VideoCreatedEvent)
  })
  it('should retrieve all stored videos', async () => {
    (repository.searchAll).mockResolvedValue([Video.fromPrimitives(videoIdValue, videoTitleValue)])

    const handler = new SearchAllVideosQueryHandler(repository)
    const videos = await handler.handle()

    expect(videos).toHaveLength(1)
  })
})
