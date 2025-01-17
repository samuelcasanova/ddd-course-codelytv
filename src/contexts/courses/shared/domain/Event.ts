export interface Event<T> {
  name: string
  created: Date
  payload: T
}
