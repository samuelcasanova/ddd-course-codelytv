import { RatingInvalidValueError } from './RatingInvalidValueError'

export class Rating {
  public readonly value: number
  constructor (value?: number) {
    if (value !== undefined && (value < 0 || value > 5 || !Number.isInteger(value))) {
      throw new RatingInvalidValueError()
    }
    this.value = value ?? 0
  }
}
