import type { CacheRepository } from '../domain/CacheRepository'

export class InMemoryCacheRepository implements CacheRepository {
  private readonly hits = new Map<string, unknown>()

  async get <T>(key: string): Promise<T | null> {
    return this.hits.get(key) as T ?? null
  }

  async set <T>(key: string, value: T, ttl?: number): Promise<void> {
    this.hits.set(key, value)
  }

  async has (key: string): Promise<boolean> {
    return this.hits.has(key)
  }

  async delete (key: string): Promise<void> {
    this.hits.delete(key)
  }

  async deleteAll (): Promise<void> {
    this.hits.clear()
  }
}
