/* eslint-disable @typescript-eslint/no-misused-promises */
import request from 'supertest'
import type { Express } from 'express'
import { type SQLiteVideoRepository } from '../../src/contexts/mooc/courses/video/infrastructure/SQLiteVideoRepository'
import { App } from '../../src/apps/mooc/backend/app'
import { Container, ids } from '../../src/apps/mooc/backend/dependencyInjection/Container'

let expressApp: Express
let repository: SQLiteVideoRepository

beforeAll(async () => {
  expressApp = (await App.getInstance()).getExpressApp()
  repository = await Container.get<SQLiteVideoRepository>(ids.video.videoRepository)
})

beforeEach(async () => {
  await repository.deleteAll()
})

describe('POST /videos', () => {
  const videoRequest = {
    id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    title: 'Hello world'
  }
  it('should create a video if the video does not exist', async () => {
    const response = await request(expressApp).post('/api/videos').send(videoRequest)

    expect(response.status).toBe(201)
  })

  it('should return 409 if the video already exists', async () => {
    await request(expressApp).post('/api/videos').send(videoRequest)
    const response = await request(expressApp).post('/api/videos').send(videoRequest)

    expect(response.status).toBe(409)
  })
})
