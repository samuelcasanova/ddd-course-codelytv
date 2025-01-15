import { Sequelize, Model, type InferAttributes, type InferCreationAttributes, DataTypes } from 'sequelize'
import { Video } from '../domain/Video'
import type { VideoRepository } from '../domain/VideoRepository'

class VideoModel extends Model<InferAttributes<VideoModel>, InferCreationAttributes<VideoModel>> {
  declare id: string
  declare title: string
  declare reviews: number
  declare rating: number
}

export class SQLiteVideoRepository implements VideoRepository {
  private readonly sequelize: Sequelize
  private static instance: SQLiteVideoRepository | null = null

  private constructor () {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: './data/database.sqlite'
    })
    VideoModel.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        reviews: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      },
      {
        sequelize: this.sequelize,
        tableName: 'videos'
      }
    )
  }

  async searchAll (): Promise<Video[]> {
    const allVideoModels = await VideoModel.findAll()
    return allVideoModels.map(videoModel => Video.fromPrimitives({ id: videoModel.id, title: videoModel.title, score: { reviews: videoModel.reviews, rating: videoModel.rating } }))
  }

  async save (video: Video): Promise<void> {
    const primitives = video.toPrimitives()
    await VideoModel.create({ ...primitives, reviews: primitives.score.reviews, rating: primitives.score.rating })
  }

  async deleteAll (): Promise<void> {
    await VideoModel.destroy({ where: {} })
  }

  static async getInstance (): Promise<SQLiteVideoRepository> {
    if (SQLiteVideoRepository.instance == null) {
      SQLiteVideoRepository.instance = new SQLiteVideoRepository()
      await SQLiteVideoRepository.instance.sequelize.sync()
    }
    return SQLiteVideoRepository.instance
  }
}
