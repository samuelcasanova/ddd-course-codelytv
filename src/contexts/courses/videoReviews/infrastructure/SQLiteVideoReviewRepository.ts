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
  private static instance: SQLiteVideoReviewRepository | null = null

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
    const allVideoModels = await VideoReviewModel.findAll()
    return allVideoModels.map(videoModel => VideoReview.fromPrimitives(videoModel))
  }

  async save (videoReview: VideoReview): Promise<void> {
    await VideoReviewModel.create(videoReview.toPrimitives())
  }

  async deleteAll (): Promise<void> {
    await VideoReviewModel.destroy({ where: {} })
  }

  static async getInstance (): Promise<SQLiteVideoReviewRepository> {
    if (SQLiteVideoReviewRepository.instance == null) {
      SQLiteVideoReviewRepository.instance = new SQLiteVideoReviewRepository()
      await SQLiteVideoReviewRepository.instance.sequelize.sync()
    }
    return SQLiteVideoReviewRepository.instance
  }
}
