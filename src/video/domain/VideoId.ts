import { randomUUID } from 'crypto'

export class VideoId {
  public readonly value: string
  constructor (value?: string) {
    this.value = value ?? randomUUID()
  }
}
