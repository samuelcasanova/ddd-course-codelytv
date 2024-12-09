class VideoRepository {
  save = jest.fn()
  find = jest.fn()
}

describe('Video repository', () => {
  it.skip('should create a video', async () => {
    const repository = new VideoRepository()
    repository.save({ id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', title: 'Hello world' })

    const video = await repository.find('0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d')

    expect(video).toMatchObject({ title: 'Hello world' })
  })
})
