import { RatingInvalidValueError } from './RatingInvalidValueError'

export class Rating {
  public readonly value: number
  constructor (value?: number) {
    if (value !== undefined && (value < 0 || value > 5)) {
      throw new RatingInvalidValueError()
    }
    this.value = value ?? 0
  }
}
