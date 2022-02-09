import { CamelCasedPropertiesDeep } from 'type-fest'

import { camelizeKeys } from '@/backend/common/utils'

import { OMDbApi, OMDbMovie } from '../../externalAPI/OMDbApi'

export type OMDbMetadata = {
  rottenTomatoesRating: number | undefined
} & CamelCasedPropertiesDeep<Omit<OMDbMovie, 'Ratings'>>

export class OMDbMetadataAgent {
  readonly agentName = 'OMDb'
  api?: OMDbApi

  constructor(omdbKey: string | null) {
    if (omdbKey) {
      this.api = new OMDbApi(omdbKey)
    }
  }

  async getMetadata(imdbId: string): Promise<OMDbMetadata | undefined> {
    if (!this.api) return

    const metadata = await this.api.findByIMDbId(imdbId)

    if (!metadata) return undefined

    const { Ratings, ...restObj } = metadata

    return camelizeKeys({
      rottenTomatoesRating: Ratings.rottenTomatoes,
      ...restObj,
    })
  }
}
