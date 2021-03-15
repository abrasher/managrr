import NodeCache from 'node-cache'

class Cache {
  cache: NodeCache
  constructor() {
    this.cache = new NodeCache({
      useClones: false,
    })
  }

  async get<T>(key: string, val: Promise<T>): Promise<T> {
    const value = this.cache.get<T>(key)

    if (value) {
      return value
    }

    const result = await val
    this.cache.set(key, result)

    return result
  }
}

const cache = new Cache()

export { cache }
