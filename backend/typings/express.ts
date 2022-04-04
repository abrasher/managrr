import { Request, Response } from 'express'
import { Context } from 'types'

export interface IRequest extends Request {
  context: Context
  cookies: {
    refreshToken: string
    accessToken: string
  }
}

export interface IExpressContext {
  req: IRequest
  res: Response
}
