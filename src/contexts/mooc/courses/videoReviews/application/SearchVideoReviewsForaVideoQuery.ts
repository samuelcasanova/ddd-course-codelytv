import type { Query } from '../../shared/domain/Query'

export class SearchVideoReviewsForaVideoQuery implements Query {
  name = 'SearchVideoReviewsForaVideoQuery'
  constructor (public readonly videoId: string) { }
}
