import { CamelCasedPropertiesDeep } from 'type-fest'

import { camelizeKeys } from '@/lib/utils'

import { OMDbApi, OMDbMovie } from '../omdbapi/OMDbApi'

export type OMDbMetadata = CamelCasedPropertiesDeep<OMDbMovie>

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

    return camelizeKeys(metadata)
  }
}
