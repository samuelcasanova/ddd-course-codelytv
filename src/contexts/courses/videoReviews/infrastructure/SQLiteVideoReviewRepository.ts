import { Sequelize, Model, type InferAttributes, type InferCreationAttributes, DataTypes } from 'sequelize'
import type { VideoReviewRepository } from '../domain/VideoReviewRepository'
import { VideoReview } from '../domain/VideoReview'

class VideoReviewModel extends Model<InferAttributes<VideoReviewModel>, InferCreationAttributes<VideoReviewModel>> {
  declare id: string
  declare videoId: string
  declare rating: number
  declare comment: string
}

export class SQLiteVideoReviewRepository implements VideoReviewRepository {
  private readonly sequelize: Sequelize
  private static readonly instance: SQLiteVideoReviewRepository | null = null

  private constructor () {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: './data/database.sqlite'
    })
    VideoReviewModel.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        videoId: {
          type: DataTypes.STRING,
          allowNull: false
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        comment: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize: this.sequelize,
        tableName: 'videoReviews'
      }
    )
  }

  async searchAll (): Promise<VideoReview[]> {
    const allVideoReviewModels = await VideoReviewModel.findAll()
    const videoReviews = allVideoReviewModels.map(videoModel => VideoReview.fromPrimitives(videoModel))
    return videoReviews
  }

  async searchByVideoId (videoId: string): Promise<VideoReview[]> {
    const videoReviewModels = await VideoReviewModel.findAll({ where: { videoId } })
    if (videoReviewModels === null) {
      return []
    }
    const videoReviews = videoReviewModels.map(videoModel => VideoReview.fromPrimitives(videoModel))
    return videoReviews
  }

  async save (videoReview: VideoReview): Promise<void> {
    await VideoReviewModel.upsert(videoReview.toPrimitives())
  }

  async deleteAll (): Promise<void> {
    await VideoReviewModel.destroy({ where: {} })
  }

  async init (): Promise<void> {
    await this.sequelize.sync()
  }
}
