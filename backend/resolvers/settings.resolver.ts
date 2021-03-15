import {
  Mutation,
  Query,
  Resolver,
  Arg,
  FieldResolver,
  Root,
  Ctx,
  Int,
} from 'type-graphql'
import { Service } from 'typedi'
import { PlexSettings, Settings } from '@generated/type-graphql'
import { ContextType } from '../types'
import { SettingsRepository } from '../repositories'
import { PlexSettingsInput, SettingsInput } from './types/settings.type'
import { PlexServer } from '../plexapi'

@Service()
@Resolver((of) => Settings)
export class SettingsResolver {
  constructor(private readonly settingsRepo: SettingsRepository) {}

  @Query((returns) => Settings)
  async settings(): Promise<Settings> {
    return await this.settingsRepo.findOrMake()
  }

  @FieldResolver((returns) => [PlexSettings])
  async plex(
    @Root() settings: Settings,
    @Ctx() context: ContextType
  ): Promise<PlexSettings[]> {
    return await context.prisma.plexSettings.findMany({
      where: { settingsId: settings.id },
    })
  }

  @Mutation((returns) => Settings)
  async updateSettings(@Arg('data') input: SettingsInput): Promise<Settings> {
    return await this.settingsRepo.updateSettings(input)
  }

  @Mutation((returns) => PlexSettings)
  async updatePlex(
    @Arg('data') input: PlexSettingsInput
  ): Promise<PlexSettings> {
    return await this.settingsRepo.updatePlex(input)
  }

  @Mutation((returns) => PlexSettings)
  async deletePlex(
    @Ctx() context: ContextType,
    @Arg('id', (type) => Int) id: number
  ): Promise<PlexSettings> {
    return await context.prisma.plexSettings.delete({ where: { id } })
  }

  @Query((returns) => Boolean)
  testPlex(@Arg('data') { url, token }: PlexSettingsInput): Promise<boolean> {
    // try {
    //   await PlexServer.build(url, token)
    //   return true
    // } catch (err) {
    //   //throw new Error('custom error')
    //   return false
    // }
    return PlexServer.testConnection(url, token)
  }
}
