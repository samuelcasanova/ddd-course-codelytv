/* eslint-disable @typescript-eslint/no-misused-promises */
import request from 'supertest'
import type { Express } from 'express'
import { type SQLiteVideoRepository } from '../../src/contexts/mooc/courses/video/infrastructure/SQLiteVideoRepository'
import { VideoMother } from '../domain/VideoMother'
import { App } from '../../src/apps/mooc/backend/app'
import { Container, ids } from '../../src/apps/mooc/backend/dependencyInjection/Container'

let expressApp: Express

beforeAll(async () => {
  expressApp = (await App.getInstance()).getExpressApp()
  const repository = await Container.get<SQLiteVideoRepository>(ids.video.videoRepository)
  await repository.deleteAll()
})
describe('GET /videos', () => {
  it('should get all videos', async () => {
    await request(expressApp).post('/api/videos').send(VideoMother.create().toPrimitives())
    await request(expressApp).post('/api/videos').send(VideoMother.create().toPrimitives())
    await request(expressApp).post('/api/videos').send(VideoMother.create().toPrimitives())

    const response = await request(expressApp).get('/api/videos')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(3)
  })
})
