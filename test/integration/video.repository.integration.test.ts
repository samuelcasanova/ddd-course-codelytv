import { Video } from '../../src/contexts/courses/video/domain/Video'
import { SQLiteVideoRepository } from '../../src/contexts/courses/video/infrastructure/SQLiteVideoRepository'

let repository: SQLiteVideoRepository

beforeAll(async () => {
  repository = await SQLiteVideoRepository.getInstance()
  await (repository as unknown as { sequelize: { truncate: () => Promise<void> } }).sequelize.truncate()
})
describe('Video repository integration tests', () => {
  it('should create and then retrieve videos', async () => {
    const video = Video.fromPrimitives({ id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', title: 'Hello world' })

    await repository.save(video)

    const videos = await repository.searchAll()

    expect(videos).toHaveLength(1)
    expect(videos[0].toPrimitives()).toMatchObject(video.toPrimitives())
  })
})
