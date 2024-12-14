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
  it('should create a video', async () => {
    const createVideoCommand = givenaUserWantsToCreateaVideo()
    await whenTheVideoIsCreated(createVideoCommand)
    thenItsSavedInTheRepositoryAndAnEventIsPublished()
  })

  it('should retrieve all stored videos', async () => {
    givenaVideoIsInTheRepository()
    const videos = await whenaUserSearchsForAllVideos()
    thenTheyFindTheVideo(videos)
  })
})

function thenTheyFindTheVideo (videos: Video[]): void {
  expect(repository.searchAll).toHaveBeenCalled()
  expect(videos).toHaveLength(1)
}

async function whenaUserSearchsForAllVideos (): Promise<Video[]> {
  const handler = new SearchAllVideosQueryHandler(repository)
  const videos = await handler.handle()
  return videos
}

function givenaVideoIsInTheRepository (): void {
  (repository.searchAll).mockResolvedValue([Video.fromPrimitives(videoIdValue, videoTitleValue)])
}

function thenItsSavedInTheRepositoryAndAnEventIsPublished (): void {
  expect(repository.save).toHaveBeenCalled()
  expect(eventBus.publishAll.mock.calls[0][0]).toHaveLength(1)
  expect(eventBus.publishAll.mock.calls[0][0][0]).toBeInstanceOf(VideoCreatedEvent)
}

async function whenTheVideoIsCreated (createVideoCommand: CreateVideoCommand): Promise<void> {
  const handler = new CreateVideoCommandHandler(repository, eventBus)
  await handler.handle(createVideoCommand)
}

function givenaUserWantsToCreateaVideo (): CreateVideoCommand {
  return new CreateVideoCommand(videoIdValue, videoTitleValue)
}
