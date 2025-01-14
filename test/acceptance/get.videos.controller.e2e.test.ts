/* eslint-disable @typescript-eslint/no-misused-promises */
import request from 'supertest'
import type { Express } from 'express'
import { SQLiteVideoRepository } from '../../src/contexts/courses/video/infrastructure/SQLiteVideoRepository'
import { VideoMother } from '../domain/VideoMother'
import { App } from '../../src/contexts/courses/shared/infrastructure/app'

let expressApp: Express

beforeAll(async () => {
  expressApp = (await App.getInstance()).getExpressApp()
  const repository = await SQLiteVideoRepository.getInstance()
  await repository.deleteAll()
})
describe('GET /videos', () => {
  it('should get all videos', async () => {
    await request(expressApp).post('/api/videos').send(VideoMother.random().toPrimitives())
    await request(expressApp).post('/api/videos').send(VideoMother.random().toPrimitives())
    await request(expressApp).post('/api/videos').send(VideoMother.random().toPrimitives())

    const response = await request(expressApp).get('/api/videos')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(3)
  })
})
