import type { EventBus, EventSubscriber } from '../../src/contexts/courses/shared/domain/EventBus'
import type { Event } from '../../src/contexts/courses/shared/domain/Event'
import { ReviewVideoCommand } from '../../src/contexts/courses/videoReviews/application/ReviewVideoCommand'
import { ReviewVideoCommandHandler } from '../../src/contexts/courses/videoReviews/application/ReviewVideoCommandHandler'
import { VideoReview } from '../../src/contexts/courses/videoReviews/domain/VideoReview'
import { SearchAllVideoReviewsQuery } from '../../src/contexts/courses/videoReviews/application/SearchAllVideoReviewsQuery'
import { SearchAllVideoReviewsQueryHandler } from '../../src/contexts/courses/videoReviews/application/SearchAllVideoReviewsQueryHandler'
import type { VideoReviewsResponse } from '../contexts/courses/videoReviews/application/VideoReviewsResponse'
import { SearchVideoReviewsForaVideoQuery } from '../../src/contexts/courses/videoReviews/application/SearchVideoReviewsForaVideoQuery'
import { SearchVideoReviewsForaVideoQueryHandler } from '../../src/contexts/courses/videoReviews/application/SearchVideoReviewsForaVideoQueryHandler'

const videoReviewPrimitives = {
  id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  videoId: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e',
  rating: 5,
  comment: 'Hello world nice video'
}

const mockRepository = {
  save: jest.fn(),
  searchAll: jest.fn(),
  searchByVideoId: jest.fn(),
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
}

const spyEventBus = new SpyEventBus()

describe('Review Video', () => {
  it('should review a video if the video exists', async () => {
    const reviewVideoCommand = givenaUserWantsToReviewaVideo()
    andThisVideoExists()
    await whenTheVideoIsReviewed(reviewVideoCommand)
    thenChecksThatTheVideoExists()
    andItsSavedInTheRepositoryAndAnEventIsPublished()
  })

  it('should throw if the video does not exist', async () => {
    const reviewVideoCommand = givenaUserWantsToReviewaVideo()
    andThisVideoDoesNotExist()
    void expect(async () => { await whenTheVideoIsReviewed(reviewVideoCommand) }).rejects.toThrow()
  })

  it('should retrieve the reviews for all videos', async () => {
    givenaVideoWithReviewsIsInTheRepository()
    const videoReviewsResponse = await whenaUserSearchsForAllVideoReviews()
    thenTheyFindTheVideoReview(videoReviewsResponse)
  })

  it('should retrieve the reviews for a video', async () => {
    givenaVideoWithReviewsIsInTheRepository()
    const videoReviewsResponse = await whenaUserSearchsForVideoReviewsForaVideo(videoReviewPrimitives.videoId)
    thenTheyFindTheVideoReviewsForThatVideo(videoReviewsResponse)
  })
})

function thenTheyFindTheVideoReview (videoReviewsResponse: VideoReviewsResponse): void {
  expect(mockRepository.searchAll).toHaveBeenCalled()
  expect(videoReviewsResponse.videoReviews).toHaveLength(1)
}

function thenTheyFindTheVideoReviewsForThatVideo (videoReviewsResponse: VideoReviewsResponse): void {
  expect(mockRepository.searchByVideoId).toHaveBeenCalled()
  expect(videoReviewsResponse.videoReviews).toHaveLength(1)
}

async function whenaUserSearchsForAllVideoReviews (): Promise<VideoReviewsResponse> {
  const query = new SearchAllVideoReviewsQuery()
  const handler = new SearchAllVideoReviewsQueryHandler(mockRepository)
  return await handler.ask(query)
}

async function whenaUserSearchsForVideoReviewsForaVideo (videoId: string): Promise<VideoReviewsResponse> {
  const query = new SearchVideoReviewsForaVideoQuery(videoId)
  const handler = new SearchVideoReviewsForaVideoQueryHandler(mockRepository)
  return await handler.ask(query)
}

function givenaVideoWithReviewsIsInTheRepository (): void {
  const videoReviewsForaVideo = [VideoReview.fromPrimitives(videoReviewPrimitives)]
  mockRepository.searchAll.mockResolvedValue(videoReviewsForaVideo)
  mockRepository.searchByVideoId.mockResolvedValue(videoReviewsForaVideo)
}

function andItsSavedInTheRepositoryAndAnEventIsPublished (): void {
  expect(mockRepository.save).toHaveBeenCalled()
  expect(spyEventBus.publishAllHasBeenCalledOnce()).toBe(true)
}

async function whenTheVideoIsReviewed (reviewVideoCommand: ReviewVideoCommand): Promise<void> {
  const handler = new ReviewVideoCommandHandler(mockRepository, spyEventBus, mockQueryBus)
  await handler.handle(reviewVideoCommand)
}

function givenaUserWantsToReviewaVideo (): ReviewVideoCommand {
  return new ReviewVideoCommand(videoReviewPrimitives.id, videoReviewPrimitives.videoId, videoReviewPrimitives.rating, videoReviewPrimitives.comment)
}

function thenChecksThatTheVideoExists (): void {
  expect(mockQueryBus.ask.mock.calls[0][0].id).toBe(videoReviewPrimitives.videoId)
}

function andThisVideoExists (): void {
  mockQueryBus.ask.mockResolvedValue({ id: videoReviewPrimitives.videoId })
}

function andThisVideoDoesNotExist (): void {
  mockQueryBus.ask.mockRejectedValue(new Error('Video not found'))
}
