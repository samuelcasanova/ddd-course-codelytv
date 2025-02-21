export interface CacheRepository {
  get: <T>(key: string) => Promise<T | null>
  has: (key: string) => Promise<boolean>
  set: <T>(key: string, value: T, ttl?: number) => Promise<void>
  deleteAll: () => Promise<void>
}
