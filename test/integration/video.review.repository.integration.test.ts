import { VideoReview } from '../../src/contexts/courses/videoReviews/domain/VideoReview'
import { SQLiteVideoReviewRepository } from '../../src/contexts/courses/videoReviews/infrastructure/SQLiteVideoReviewRepository'

let repository: SQLiteVideoReviewRepository

beforeEach(async () => {
  repository = await SQLiteVideoReviewRepository.getInstance()
  await (repository as unknown as { sequelize: { truncate: () => Promise<void> } }).sequelize.truncate()
})
describe('VideoReview repository integration tests', () => {
  it('should create and then retrieve video reviews', async () => {
    const videoReview = VideoReview.fromPrimitives({ id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', videoId: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e', rating: 5, comment: 'Hello world' })

    await repository.save(videoReview)

    const videoReviews = await repository.searchAll()

    expect(videoReviews).toHaveLength(1)
    expect(videoReviews[0].toPrimitives()).toMatchObject(videoReview.toPrimitives())
  })

  it('should retrieve video reviews for a specific video', async () => {
    const videoReview = VideoReview.fromPrimitives({ id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', videoId: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e', rating: 5, comment: 'Hello world' })
    const videoReview2 = VideoReview.fromPrimitives({ id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6a', videoId: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6b', rating: 3, comment: 'Hello world 2' })

    await repository.save(videoReview)
    await repository.save(videoReview2)

    const videoReviews = await repository.searchByVideoId('0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e')

    expect(videoReviews).toHaveLength(1)
    expect(videoReviews[0].id.value).toBe('0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d')
  })
})
