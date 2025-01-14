import { RatingInvalidValueError } from './RatingInvalidValueError'

export class Rating {
  constructor (public readonly value: number) {
    if (value < 1 || value > 5 || !Number.isInteger(value)) {
      throw new RatingInvalidValueError()
    }
  }
}
