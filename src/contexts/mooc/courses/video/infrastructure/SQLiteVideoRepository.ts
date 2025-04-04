import { Sequelize, Model, type InferAttributes, type InferCreationAttributes, DataTypes } from 'sequelize'
import { Video } from '../domain/Video'
import type { VideoRepository } from '../domain/VideoRepository'
import type { Id } from '../../shared/domain/Id'
import { NotFoundError } from '../../shared/infrastructure/NotFoundError'

class VideoModel extends Model<InferAttributes<VideoModel>, InferCreationAttributes<VideoModel>> {
  declare id: string
  declare title: string
  declare reviews: number
  declare rating: number
}

export class SQLiteVideoRepository implements VideoRepository {
  private readonly sequelize: Sequelize
  private static readonly instance: SQLiteVideoRepository | null = null

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

  async find (id: Id): Promise<Video> {
    const video = await this.search(id)
    if (video === null) {
      throw new NotFoundError(`Video with id ${id.value} not found`)
    }
    return video
  }

  async search (id: Id): Promise<Video | null> {
    const videoModel = await VideoModel.findByPk(id.value)
    return videoModel === null ? null : Video.fromPrimitives({ id: videoModel.id, title: videoModel.title, score: { reviews: videoModel.reviews, rating: videoModel.rating } })
  }

  async searchAll (): Promise<Video[]> {
    const allVideoModels = await VideoModel.findAll()
    return allVideoModels.map(videoModel => Video.fromPrimitives({ id: videoModel.id, title: videoModel.title, score: { reviews: videoModel.reviews, rating: videoModel.rating } }))
  }

  async save (video: Video): Promise<void> {
    const primitives = video.toPrimitives()
    await VideoModel.upsert({ ...primitives, ...primitives.score })
  }

  async deleteAll (): Promise<void> {
    await VideoModel.destroy({ where: {} })
  }

  async init (): Promise<void> {
    await this.sequelize.sync()
  }
}
