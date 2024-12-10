import { Sequelize, Model, type InferAttributes, type InferCreationAttributes, DataTypes } from 'sequelize'
import { Video } from '../domain/Video'
import type { VideoRepository } from '../domain/VideoRepository'

class VideoModel extends Model<InferAttributes<VideoModel>, InferCreationAttributes<VideoModel>> {
  declare id: string
  declare title: string
}

export class SQLiteVideoRepository implements VideoRepository {
  private readonly sequelize: Sequelize
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
    return allVideoModels.map(videoModel => Video.fromPrimitives(videoModel.id, videoModel.title))
  }

  async save (video: Video): Promise<void> {
    await VideoModel.create(video.toPrimitives())
  }

  static async create (): Promise<SQLiteVideoRepository> {
    const repository = new SQLiteVideoRepository()
    await repository.sequelize.sync()
    return repository
  }
}
