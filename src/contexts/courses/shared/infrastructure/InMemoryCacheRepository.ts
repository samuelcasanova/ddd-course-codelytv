import type { CacheRepository } from '../domain/CacheRepository'

export class InMemoryCacheRepository implements CacheRepository {
  private hits: Record<string, unknown> = {}

  async get <T>(key: string): Promise<T | null> {
    return this.hits[key] as T ?? null
  }

  async set <T>(key: string, value: T, ttl?: number): Promise<void> {
    this.hits[key] = value
  }

  async has (key: string): Promise<boolean> {
    return this.hits[key] != null
  }

  async deleteAll (): Promise<void> {
    this.hits = {}
  }
}
