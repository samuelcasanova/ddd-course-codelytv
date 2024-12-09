import { type VideoRepository } from '../../src/video/domain/VideoRepository'
import { type EventBus } from '../../src/shared/domain/EventBus'
import { CreateVideoCommand } from '../../src/video/application/CreateVideoCommand'
import { CreateVideoCommandHandler } from '../../src/video/application/CreateVideoCommandHandler'
import { VideoCreatedEvent } from '../../src/video/domain/VideoCreatedEvent'
import { Video } from '../../src/video/domain/Video'

const videoIdValue = '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'
const videoTitleValue = 'Hello world'

const repository: VideoRepository = {
  save: jest.fn(),
  searchAll: jest.fn().mockResolvedValue([
    Video.fromPrimitives(videoIdValue, videoTitleValue),
    Video.fromPrimitives(videoIdValue, videoTitleValue)
  ])
}

const mockPublishAll = jest.fn()
const eventBus: EventBus = {
  publish: jest.fn(),
  publishAll: mockPublishAll
}

class SearchAllVideosQueryHandler {
  constructor (private readonly repository: VideoRepository) { }
  async handle (): Promise<Video[]> {
    return await this.repository.searchAll()
  }
}

describe('Video', () => {
  it('should create a video from primitives', async () => {
    const createVideoCommand = new CreateVideoCommand(videoIdValue, videoTitleValue)

    const handler = new CreateVideoCommandHandler(repository, eventBus)
    await handler.handle(createVideoCommand)

    expect(repository.save).toHaveBeenCalled()
    expect(mockPublishAll.mock.calls[0][0]).toHaveLength(1)
    expect(mockPublishAll.mock.calls[0][0][0]).toBeInstanceOf(VideoCreatedEvent)
  })
  it('should retrieve all stored videos', async () => {
    const handler = new SearchAllVideosQueryHandler(repository)
    const videos = await handler.handle()

    expect(videos).toHaveLength(2)
  })
})
