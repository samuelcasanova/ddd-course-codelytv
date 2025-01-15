import { CreateVideoCommand } from '../../src/contexts/courses/video/application/CreateVideoCommand'
import { CreateVideoCommandHandler } from '../../src/contexts/courses/video/application/CreateVideoCommandHandler'
import { Video } from '../../src/contexts/courses/video/domain/Video'
import { SearchAllVideosQueryHandler } from '../../src/contexts/courses/video/application/SearchAllVideosQueryHandler'
import type { EventBus } from '../../src/contexts/courses/shared/domain/EventBus'
import { SearchAllVideosQuery } from '../../src/contexts/courses/video/application/SearchAllVideosQuery'
import type { VideosResponse } from '../../src/contexts/courses/video/application/VideosResponse'

const videoPrimitives = { id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', title: 'Hello world', score: { reviews: 0, rating: 0 } }

const repository = {
  save: jest.fn(),
  searchAll: jest.fn()
}

class SpyEventBus implements EventBus {
  private publishAllCallCount = 0

  subscribe (eventName: string, handler: (event: any) => void): void {
  }

  publish (event: any): void {
  }

  publishAll (events: any[]): void {
    this.publishAllCallCount++
  }

  publishAllHasBeenCalledOnce (): boolean {
    return this.publishAllCallCount === 1
  }
}

const eventBus = new SpyEventBus()

describe('Video', () => {
  it('should create a video', async () => {
    const createVideoCommand = givenaUserWantsToCreateaVideo()
    await whenTheVideoIsCreated(createVideoCommand)
    thenItsSavedInTheRepositoryAndAnEventIsPublished()
  })

  it('should retrieve all stored videos', async () => {
    givenaVideoIsInTheRepository()
    const videosResponse = await whenaUserSearchsForAllVideos()
    thenTheyFindTheVideo(videosResponse)
  })

  it('should review a video', async () => {
    givenaVideoIsInTheRepository()
  })
})

function thenTheyFindTheVideo (videosResponse: VideosResponse): void {
  expect(repository.searchAll).toHaveBeenCalled()
  expect(videosResponse.videos).toHaveLength(1)
}

async function whenaUserSearchsForAllVideos (): Promise<VideosResponse> {
  const query = new SearchAllVideosQuery()
  const handler = new SearchAllVideosQueryHandler(repository)
  return await handler.ask(query)
}

async function whenaUserReviewstheVideo (): Promise<void> {
  eventBus.publish(new Event('video.reviewed'))
}

function givenaVideoIsInTheRepository (): void {
  (repository.searchAll).mockResolvedValue([Video.fromPrimitives(videoPrimitives)])
}

function thenItsSavedInTheRepositoryAndAnEventIsPublished (): void {
  expect(repository.save).toHaveBeenCalled()
  expect(eventBus.publishAllHasBeenCalledOnce()).toBe(true)
}

async function whenTheVideoIsCreated (createVideoCommand: CreateVideoCommand): Promise<void> {
  const handler = new CreateVideoCommandHandler(repository, eventBus)
  await handler.handle(createVideoCommand)
}

function givenaUserWantsToCreateaVideo (): CreateVideoCommand {
  return new CreateVideoCommand(videoPrimitives.id, videoPrimitives.title)
}
