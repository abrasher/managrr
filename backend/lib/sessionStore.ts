import { Session } from '@entities/session.entity'
import { EntityManager } from '@mikro-orm/core'

export class TokenStore {
  private em: EntityManager
  private ttl = 86400 * 1000

  constructor(em: EntityManager) {
    this.em = em
  }

  get(sid: string, callback: (err?: unknown | undefined, session?: SessionData) => void): void {
    this.em
      .findOne(Session, { id: sid })
      .then((result) => {
        if (result === null) return callback()

        callback(undefined, result.session)
      })
      .catch((err) => callback(err, undefined))
  }

  set(sid: string, session: SessionData, callback: (err?: unknown) => void): void {
    this.em
      .findOne(Session, { id: sid })
      .then((result) => {
        const expiredAt = Date.now() + this.ttl
        if (result) {
          result.expiredAt = expiredAt
          result.session = session
        } else {
          const newSession = this.em.create(Session, {
            expiredAt,
            session,
          })
          this.em.persist(newSession)
        }

        this.em
          .flush()
          .then(() => callback())
          .catch((err) => callback(err))
      })
      .catch((err) => callback(err))
  }

  destroy(sid: string | string[], callback: (err?: unknown) => void): void {
    const ids = []
    typeof sid === 'string' ? ids.push(sid) : ids.push(...sid)
    this.em
      .nativeDelete(Session, { id: { $in: ids } })
      .then(() => callback())
      .catch((err) => callback(err))
  }

  all(callback: (err: unknown | undefined, sessions: SessionData[]) => void): void {
    this.em
      .find(Session, {})
      .then((sessions) =>
        callback(
          undefined,
          sessions.map((session) => ({ cookie: session.session.cookie }))
        )
      )
      .catch((err) => callback(err, []))
  }

  clear(callback: (err?: unknown) => void): void {
    this.em
      .find(Session, {})
      .then((sessions) => {
        sessions.forEach((session) => this.em.remove(session))
        this.em
          .flush()
          .then(() => callback())
          .catch((err) => callback(err))
      })
      .catch((err) => callback(err))
  }

  length(callback: (err: unknown | undefined, length: number) => void): void {
    this.em
      .count(Session, {})
      .then((num) => callback(undefined, num))
      .catch((err) => callback(err, 0))
  }

  touch(sid: string, session: SessionData, callback: () => void): void {
    this.em
      .findOne(Session, { id: sid })
      .then((sessionEntity) => {
        if (!sessionEntity) {
          return callback()
        }
        sessionEntity.session = session
        sessionEntity.expiredAt = Date.now() + this.ttl

        this.em
          .flush()
          .then(() => callback())
          .catch((err) => callback())
      })
      .catch((err) => callback())
  }
}
