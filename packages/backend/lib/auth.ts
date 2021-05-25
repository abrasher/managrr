import { EntityManager } from '@mikro-orm/core'
import { AuthenticationError } from 'apollo-server-express'
import bcrypt from 'bcrypt'
import { CookieOptions, Handler } from 'express'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

import { IRequest } from '@/backend/typings/express'

import { User } from '../entities/user.entity'
import { storage } from '../loaders/asyncStorage'
import { logger } from './logger'
import { getSystemSettings } from './systemSettings'

type CookieFuncParams = [string, unknown, CookieOptions]

interface JWT {
  username: string
}

const SECONDS_IN_MONTH = 30 * 86400 * 1000
const SECONDS_IN_FIVE_MINUTE = 5 * 60 * 1000

const { instanceId } = getSystemSettings()

export const getUser = async (accessToken: string, em: EntityManager): Promise<User | null> => {
  try {
    const { username } = jwt.verify(accessToken, instanceId) as JWT
    return em.findOne(User, { username })
  } catch (err: unknown) {
    if (err instanceof TokenExpiredError) {
      throw new AuthenticationError('Authenication Error: JWT Expired')
    } else if (err instanceof JsonWebTokenError) {
      throw new AuthenticationError(`Authenication Error: JWT Error \n ${err.message}`)
    }
    logger.error('Authentication Error: Unknown', err)
    throw err
  }
}

export const sign = (username: string, expiresIn: number | string): string => {
  const token = jwt.sign({ username }, instanceId, {
    expiresIn,
    algorithm: 'HS256',
    issuer: 'managrr',
  })

  return token
}

const verify = (token: string): JWT => {
  const payload = jwt.verify(token, instanceId, {
    issuer: 'managrr',
    algorithms: ['HS256'],
  })

  return payload as JWT
}

const makeRefreshCookie = async (
  username: string,
  em: EntityManager
): Promise<CookieFuncParams> => {
  const user = await em.findOneOrFail(User, { username })

  const refreshToken = sign(username, SECONDS_IN_MONTH)

  user.refreshToken = refreshToken

  await em.flush()

  return ['refreshToken', refreshToken, { maxAge: SECONDS_IN_MONTH * 1000, httpOnly: true }]
}

const makeAccessCookie = (username: string): CookieFuncParams => {
  return [
    'accessToken',
    sign(username, SECONDS_IN_FIVE_MINUTE),
    { maxAge: SECONDS_IN_FIVE_MINUTE * 1000, httpOnly: true },
  ]
}

export const refresh: Handler = async (req: IRequest, res) => {
  const { refreshToken } = req.cookies

  if (!refreshToken) {
    return res.status(401).end()
  }

  const { username } = verify(refreshToken)

  const em = storage.getStore()

  if (!em) return res.status(400).send('User Not Found')
  const user = await em.findOne(User, { username })

  if (user) {
    if (user.refreshToken === refreshToken) {
      const accessToken = makeAccessCookie(username)
      const refreshToken = await makeRefreshCookie(username, em)

      res.cookie(...accessToken)
      res.cookie(...refreshToken)

      return res.end()
    }
    return res.status(401).send('Refresh Token does not match')
  }
  res.status(400).end()
}

export const login: Handler = async (req, res) => {
  const { username, password } = req.body
  const em = storage.getStore()

  if (!em) return res.status(401).end()

  const user = await em.findOne(User, { username })

  if (!user) {
    return res.status(401).end()
  }

  const passwordHash = user.password

  if (bcrypt.compareSync(password, passwordHash)) {
    const accessToken = makeAccessCookie(username)
    const refreshToken = await makeRefreshCookie(username, em)

    res.cookie(...accessToken)
    res.cookie(...refreshToken)

    res.end()
  }
  return res.status(401).end()
}

export const logout: Handler = async (req: IRequest, res) => {
  const cookies = req.cookies

  try {
    const { username } = jwt.verify(cookies.refreshToken, instanceId) as JWT
    const em = storage.getStore()

    if (!em) throw new Error('AsyncLocalStorage is not defined')
    const user = await em.findOneOrFail(User, { username })
    user.refreshToken = null
    await em.flush()
    res.end()
  } catch (err) {
    logger.error(err)
    res.end()
  }
}
