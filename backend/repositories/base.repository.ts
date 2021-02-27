import { Service } from 'typedi'
import { PrismaClient } from '@prisma/client'

@Service()
export class BaseRepository {
  constructor(protected readonly prisma: PrismaClient) {}
}
