/* eslint-disable @typescript-eslint/no-misused-promises */
import request from 'supertest'
import type { Express } from 'express'
import { App } from '../../src/contexts/courses/app'
import { SQLiteVideoRepository } from '../../src/contexts/courses/video/infrastructure/SQLiteVideoRepository'
import { VideoReviewCreatedEvent } from '../../src/contexts/courses/shared/domain/events/VideoReviewCreatedEvent'
import { SQLiteVideoReviewRepository } from '../../src/contexts/courses/videoReviews/infrastructure/SQLiteVideoReviewRepository'
import { promisify } from 'util'
import { VideoUpdatedEvent } from '../../src/contexts/courses/shared/domain/events/VideoUpdatedEvent'

let app: App
let expressApp: Express
let videoRepository: SQLiteVideoRepository
let reviewRepository: SQLiteVideoReviewRepository

const videoReviewRequest = {
  id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e',
  videoId: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  rating: 5,
  comment: 'Nice video dude!'
}

beforeAll(async () => {
  app = await App.getInstance()
  expressApp = app.getExpressApp()
  videoRepository = await SQLiteVideoRepository.getInstance()
  reviewRepository = await SQLiteVideoReviewRepository.getInstance()
})

beforeEach(async () => {
  await videoRepository.deleteAll()
  await reviewRepository.deleteAll()
})

describe('POST /videos/:videoId/reviews', () => {
  it('should create a video review', async () => {
    await request(expressApp).post('/api/videos').send({
      id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      title: 'Hello world'
    })

    const response = await request(expressApp).post('/api/videos/0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/reviews').send(videoReviewRequest)

    expect(response.status).toBe(201)
  })
})

describe('Error scenarios with video reviews the (faked) message broker', () => {
  describe('given the review video arrives before the video is created', () => {
    it('then the message should be requeued to be processed later without throwing any exception', async () => {
      const subscriber = {
        eventName: VideoUpdatedEvent.name,
        isCalled: false,
        handle: async () => {
          subscriber.isCalled = true
        }
      }
      app.eventBus.subscribe(subscriber)

      const event = new VideoReviewCreatedEvent(videoReviewRequest)
      await app.eventBus.publish(event)

      await request(expressApp).post('/api/videos').send({
        id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        title: 'Hello world'
      })

      await request(expressApp).post('/api/videos/0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/reviews').send(videoReviewRequest)

      await waitUntil(() => subscriber.isCalled)

      const response = await request(expressApp).get('/api/videos')

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(1)
      expect(response.body[0].rating).toBe(5)
    })
  })
})

async function waitUntil (condition: () => boolean): Promise<void> {
  while (true) {
    if (condition()) {
      break
    }
    await promisify(setTimeout)(100)
  }
}
