export class KeyedCollection<T, D> {
  _collection: Map<T, D[]>

  constructor() {
    this._collection = new Map()
  }

  add(key: T, data: D) {
    this._collection.set(key, [...(this._collection.get(key) ?? []), data])
  }

  get(key: T): D[] {
    return this._collection.get(key) ?? []
  }

  remove(key: T) {
    this._collection.delete(key)
  }
}
