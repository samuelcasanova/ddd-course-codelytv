import { randomUUID } from 'crypto'

export class Id {
  public readonly value: string
  constructor (value?: string) {
    this.value = value ?? randomUUID()
  }
}
