import { type App } from 'supertest/types'
import request from 'supertest'
import { app } from '../../src/shared/infrastructure/app'
import { SQLiteVideoRepository } from '../../src/video/infrastructure/SQLiteVideoRepository'

beforeAll(async () => {
  const repository = await SQLiteVideoRepository.create()
  await repository.deleteAll()
})
describe('POST /videos', () => {
  it('should create a video', async () => {
    const response = await request(app as App).post('/api/videos').send({
      id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      title: 'Hello world'
    })

    expect(response.status).toBe(201)
  })
})
