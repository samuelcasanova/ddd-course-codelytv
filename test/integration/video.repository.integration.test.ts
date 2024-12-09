const repository = {
  save: jest.fn(),
  searchAll: jest.fn()
}

describe('Video repository', () => {
  it.skip('should create a video', async () => {
    repository.save({ id: '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', title: 'Hello world' })

    const videos = await repository.searchAll()

    expect(videos).toHaveBeenCalled()
  })
})
