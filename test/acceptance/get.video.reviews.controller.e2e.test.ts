/* eslint-disable @typescript-eslint/no-misused-promises */
import request from 'supertest'
import type { Express } from 'express'
import { App } from '../../src/contexts/courses/shared/infrastructure/app'
import { SQLiteVideoReviewRepository } from '../../src/contexts/courses/videoReviews/infrastructure/SQLiteVideoReviewRepository'
import { SQLiteVideoRepository } from '../../src/contexts/courses/video/infrastructure/SQLiteVideoRepository'

let expressApp: Express

beforeAll(async () => {
  expressApp = (await App.getInstance()).getExpressApp()
  const videoRepository = await SQLiteVideoRepository.getInstance()
  await videoRepository.deleteAll()
  const reviewRepository = await SQLiteVideoReviewRepository.getInstance()
  await reviewRepository.deleteAll()
})
describe('GET /videos/:videoId/reviews', () => {
  it('should get all video reviews', async () => {
    await request(expressApp).post('/api/videos').send({
      id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      title: 'Hello world'
    })

    await request(expressApp).post('/api/videos/0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/reviews').send({
      id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5ca',
      rating: 5,
      comment: 'Nice video dude!'
    })
    await request(expressApp).post('/api/videos/0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/reviews').send({
      id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6b',
      rating: 3,
      comment: 'Not so nice man!'
    })

    const response = await request(expressApp).get('/api/videos/0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/reviews')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
  })
})
