import type { Id } from '../../shared/domain/Id'

export class VideoAlreadyExistsError extends Error {
  constructor (id: Id) {
    super(`Video with id ${id.value} already exists`)
  }
}
