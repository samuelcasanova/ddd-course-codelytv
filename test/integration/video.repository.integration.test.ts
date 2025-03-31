import { Video } from '../../src/contexts/mooc/courses/video/domain/Video'
import { type SQLiteVideoRepository } from '../../src/contexts/mooc/courses/video/infrastructure/SQLiteVideoRepository'
import { Container, ids } from '../../src/apps/mooc/backend/dependencyInjection/Container'

let repository: SQLiteVideoRepository

beforeAll(async () => {
  repository = await Container.get<SQLiteVideoRepository>(ids.video.videoRepository)
  await (repository as unknown as { sequelize: { truncate: () => Promise<void> } }).sequelize.truncate()
})
describe('Video repository integration tests', () => {
  it('should create and then retrieve videos', async () => {
    const video = Video.fromPrimitives({ id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', title: 'Hello world', score: { reviews: 0, rating: 0 } })

    await repository.save(video)

    const videos = await repository.searchAll()

    expect(videos).toHaveLength(1)
    expect(videos[0].toPrimitives()).toMatchObject(video.toPrimitives())
  })
})
