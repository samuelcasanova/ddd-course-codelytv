import { Video } from '../../src/video/domain/Video'
import { VideoId } from '../../src/video/domain/VideoId'
import { VideoTitle } from '../../src/video/domain/VideoTitle'

const videoIdValue = '0ab2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'
const videoTitleValue = 'Hello world'

describe('Video', () => {
  it('should create a video from value objects', async () => {
    const videoId = new VideoId(videoIdValue)
    const videoTitle = new VideoTitle(videoTitleValue)
    const video = Video.create(videoId, videoTitle)

    expect(video.id).toBeDefined()
    expect(video.title).toBeDefined()
    expect(video.toPrimitives()).toMatchObject({ id: videoIdValue, title: videoTitleValue })
  })

  it('should create a video from primitives', async () => {
    const video = Video.fromPrimitives(videoIdValue, videoTitleValue)

    expect(video.id).toBeDefined()
    expect(video.title).toBeDefined()
    expect(video.toPrimitives()).toMatchObject({ id: videoIdValue, title: videoTitleValue })
  })
})
