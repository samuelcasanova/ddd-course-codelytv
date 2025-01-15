/* eslint-disable @typescript-eslint/no-misused-promises */
import request from 'supertest'
import type { Express } from 'express'
import { App } from '../../src/contexts/courses/shared/infrastructure/app'
import { SQLiteVideoReviewRepository } from '../../src/contexts/courses/videoReviews/infrastructure/SQLiteVideoReviewRepository'

let expressApp: Express

beforeAll(async () => {
  expressApp = (await App.getInstance()).getExpressApp()
  const repository = await SQLiteVideoReviewRepository.getInstance()
  await repository.deleteAll()
})
describe('GET /videos/:videoId/reviews', () => {
  it('should get all videos', async () => {
    await request(expressApp).post('/api/videos').send({
      id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      title: 'Hello world'
    })

    await request(expressApp).post('/api/videos/0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/reviews').send({
      id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e',
      rating: 5,
      comment: 'Nice video dude!'
    })
    await request(expressApp).post('/api/videos/0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/reviews').send({
      id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6f',
      rating: 3,
      comment: 'Not so nice man!'
    })

    const response = await request(expressApp).get('/api/videos/0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/reviews')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
  })
})
