/**
 * Fix Metadata issues with Plex, mainly with media being stuck as recently added due to the added_at value getting corrupted
 */

import { getORM } from '@/backend/loaders/database'

import { PlexServer } from '../externalAPI/plex'
import { Media } from '../library/media.entity'
import { PlexInstance } from '../system/settings.entity'

const fix = async () => {
  const orm = await getORM()

  const now = new Date()

  const em = orm.em.fork()

  const media = await em.find(Media, {})

  for (const item of media) {
    for (const metadata of item.plexMetadata) {
      if (metadata.addedAt > now) {
        void metadata.edit({ addedAt: { value: metadata.updatedAt } })
      }
    }
  }
}
