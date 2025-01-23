import { CreateVideoCommand } from '../../src/contexts/courses/video/application/CreateVideoCommand'
import { CreateVideoCommandHandler } from '../../src/contexts/courses/video/application/CreateVideoCommandHandler'
import { Video } from '../../src/contexts/courses/video/domain/Video'
import { SearchAllVideosQueryHandler } from '../../src/contexts/courses/video/application/SearchAllVideosQueryHandler'
import type { EventBus, EventSubscriber } from '../../src/contexts/courses/shared/domain/EventBus'
import { SearchAllVideosQuery } from '../../src/contexts/courses/video/application/SearchAllVideosQuery'
import type { VideosResponse } from '../../src/contexts/courses/video/application/VideosResponse'
import type { Event } from '../../src/contexts/courses/shared/domain/Event'
import { UpdateVideoScoreCommand } from '../../src/contexts/courses/video/application/UpdateVideoScoreCommand'
import { UpdateVideoScoreCommandHandler } from '../../src/contexts/courses/video/application/UpdateVideoScoreCommandHandler'
import { VideoAlreadyExistsError } from '../../src/contexts/courses/video/application/VideoAlreadyExistsError'

const videoPrimitives = { id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', title: 'Hello world', score: { reviews: 0, rating: 0 } }
const video = Video.fromPrimitives(videoPrimitives)

const mockRepository = {
  save: jest.fn(),
  searchAll: jest.fn(),
  search: jest.fn(),
  find: jest.fn()
}

const mockQueryBus = {
  ask: jest.fn(),
  register: () => {}
}

class SpyEventBus implements EventBus {
  private publishAllCallCount = 0

  subscribe (eventSubscriber: EventSubscriber<Event<unknown>>): void {}

  publish (event: any): void {}

  publishAll (events: any[]): void {
    this.publishAllCallCount++
  }

  publishAllHasBeenCalledOnce (): boolean {
    return this.publishAllCallCount === 1
  }

  reset (): void {
    this.publishAllCallCount = 0
  }
}

const spyEventBus = new SpyEventBus()

beforeEach(() => {
  jest.clearAllMocks()
  spyEventBus.reset()
})

describe('Video', () => {
  it('should create a video', async () => {
    const createVideoCommand = givenaUserWantsToCreateaVideo()
    await whenTheVideoIsCreated(createVideoCommand)
    thenItsSavedInTheRepositoryAndAnEventIsPublished()
  })

  it('should throw if the user tries to create a video with an id that already exists', async () => {
    const createVideoCommand = givenaUserWantsToCreateaVideo()
    andaVideoWithTheSameIdIsInTheRepository()
    try {
      await whenTheVideoIsCreated(createVideoCommand)
    } catch (error) {
      thenItThrowsAVideoAlreadyExistsError(error)
    }
    expect.assertions(1)
  })

  it('should retrieve all stored videos', async () => {
    givenaVideoIsInTheRepository()
    const videosResponse = await whenaUserSearchsForAllVideos()
    thenTheyFindTheVideo(videosResponse)
  })

  it('should update the score when a video is reviewed', async () => {
    givenaVideoIsInTheRepository()
    await whenaUserReviewsTheVideo()
    thenItsSavedInTheRepositoryWithTheUpdatedScore()
    andAnEventIsPublished()
  })
})

function thenTheyFindTheVideo (videosResponse: VideosResponse): void {
  expect(mockRepository.searchAll).toHaveBeenCalled()
  expect(videosResponse.videos).toHaveLength(1)
}

async function whenaUserSearchsForAllVideos (): Promise<VideosResponse> {
  const query = new SearchAllVideosQuery()
  const handler = new SearchAllVideosQueryHandler(mockRepository)
  return await handler.ask(query)
}

function givenaVideoIsInTheRepository (): void {
  mockRepository.searchAll.mockResolvedValue([video])
  mockRepository.find.mockResolvedValue(video)
  mockQueryBus.ask.mockResolvedValue({ videoReviews: [{ id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e', videoId: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', rating: 4, comment: 'Hello world' }] })
}

function thenItsSavedInTheRepositoryAndAnEventIsPublished (): void {
  expect(mockRepository.save).toHaveBeenCalled()
  expect(spyEventBus.publishAllHasBeenCalledOnce()).toBe(true)
}

async function whenTheVideoIsCreated (createVideoCommand: CreateVideoCommand): Promise<void> {
  const handler = new CreateVideoCommandHandler(mockRepository, spyEventBus)
  await handler.handle(createVideoCommand)
}

function givenaUserWantsToCreateaVideo (): CreateVideoCommand {
  mockRepository.search.mockResolvedValue(null)
  return new CreateVideoCommand(videoPrimitives.id, videoPrimitives.title)
}

async function whenaUserReviewsTheVideo (): Promise<void> {
  const command = new UpdateVideoScoreCommand('0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 4)
  const handler = new UpdateVideoScoreCommandHandler(mockRepository, spyEventBus, mockQueryBus)
  await handler.handle(command)
}

function thenItsSavedInTheRepositoryWithTheUpdatedScore (): void {
  expect(mockRepository.save).toHaveBeenCalled()
  expect(mockRepository.save.mock.calls[0][0].id.value).toBe('0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d')
  expect(mockRepository.save.mock.calls[0][0].score.reviews.value).toBe(1)
  expect(mockRepository.save.mock.calls[0][0].score.rating.value).toBe(4)
}

function andaVideoWithTheSameIdIsInTheRepository (): void {
  mockRepository.search.mockResolvedValue(video)
}

function thenItThrowsAVideoAlreadyExistsError (error: any): void {
  expect(error).toBeInstanceOf(VideoAlreadyExistsError)
}
function andAnEventIsPublished (): void {
  expect(spyEventBus.publishAllHasBeenCalledOnce()).toBe(true)
}
