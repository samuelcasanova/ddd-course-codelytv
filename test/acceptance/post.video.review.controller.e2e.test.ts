/* eslint-disable @typescript-eslint/no-misused-promises */
import request from 'supertest'
import type { Express } from 'express'
import { App } from '../../src/apps/backend/app'
import { SQLiteVideoRepository } from '../../src/contexts/courses/video/infrastructure/SQLiteVideoRepository'
import { VideoReviewCreatedEvent } from '../../src/contexts/courses/shared/domain/events/VideoReviewCreatedEvent'
import { SQLiteVideoReviewRepository } from '../../src/contexts/courses/videoReviews/infrastructure/SQLiteVideoReviewRepository'
import { VideoReviewDeletedEvent } from '../../src/contexts/courses/shared/domain/events/VideoReviewDeletedEvent'

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
  await app.cache.deleteAll()
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

describe('Error scenarios with video reviews and a (faked) message broker', () => {
  describe('given the review video arrives before the video is created', () => {
    it('then the message should be requeued to be processed later without throwing any exception', async () => {
      const event = new VideoReviewCreatedEvent(videoReviewRequest)
      await app.eventBus.publish(event)

      await request(expressApp).post('/api/videos').send({
        id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
        title: 'Hello world'
      })

      await request(expressApp).post('/api/videos/0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/reviews').send(videoReviewRequest)

      await flushEventLoop()

      const response = await request(expressApp).get('/api/videos')

      expect(response.body[0].rating).toBe(5)
    })

    describe('given the review video arrives twice', () => {
      it('then the message should be processed only once and the counter should be incremented by only one', async () => {
        await request(expressApp).post('/api/videos').send({
          id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
          title: 'Hello world'
        })

        const event = new VideoReviewCreatedEvent(videoReviewRequest)
        await app.eventBus.publish(event)
        await app.eventBus.publish(event)

        await flushEventLoop()

        const response = await request(expressApp).get('/api/videos')

        expect(response.body[0].reviews).toBe(1)
      })
    })

    describe('given a video review should be reverted (for any reason, as part of an implicit saga, for a user request...)', () => {
      it('then the rating should be the same as before and the cache should be cleaned', async () => {
        await request(expressApp).post('/api/videos').send({
          id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
          title: 'Hello world'
        })

        const createEvent = new VideoReviewCreatedEvent(videoReviewRequest)
        await app.eventBus.publish(createEvent)
        const anotherCreateEvent = new VideoReviewCreatedEvent({ ...videoReviewRequest, id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6f', rating: 3 })
        await app.eventBus.publish(anotherCreateEvent)

        await flushEventLoop()

        const deleteEvent = new VideoReviewDeletedEvent(videoReviewRequest)
        await app.eventBus.publish(deleteEvent)

        await flushEventLoop()

        const response = await request(expressApp).get('/api/videos')

        expect(response.body[0].reviews).toBe(1)
        expect(response.body[0].rating).toBe(3)
      })
    })
  })
})

async function flushEventLoop (): Promise<void> {
  await new Promise(setImmediate)
}
