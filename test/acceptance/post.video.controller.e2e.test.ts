/* eslint-disable @typescript-eslint/no-misused-promises */
import request from 'supertest'
import type { Express } from 'express'
import { SQLiteVideoRepository } from '../../src/contexts/courses/video/infrastructure/SQLiteVideoRepository'
import { App } from '../../src/contexts/courses/shared/infrastructure/app'

let expressApp: Express

beforeAll(async () => {
  expressApp = (await App.getInstance()).getExpressApp()
  const repository = await SQLiteVideoRepository.getInstance()
  await repository.deleteAll()
})
describe('POST /videos', () => {
  it('should create a video', async () => {
    const response = await request(expressApp).post('/api/videos').send({
      id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      title: 'Hello world'
    })

    expect(response.status).toBe(201)
  })
})
