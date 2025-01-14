export class RatingInvalidValueError extends Error {
  constructor () {
    super('Rating value should be an integer between 1 and 5')
  }
}
