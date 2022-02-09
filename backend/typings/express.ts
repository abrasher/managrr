import { Request } from 'express'

export interface IRequest extends Request {
  cookies: {
    refreshToken: string
    accessToken: string
  }
}
