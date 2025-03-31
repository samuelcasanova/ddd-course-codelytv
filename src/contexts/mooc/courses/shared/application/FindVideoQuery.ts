import type { Query } from '../domain/Query'

export class FindVideoQuery implements Query {
  name = 'FindVideoQuery'

  constructor (public readonly id: string) { }
}
