import { EntityManager, MikroORM } from '@mikro-orm/core'

import { PlexMediaEntity } from '../entities/Plex/plexMedia.entity'
import { PlexSectionEntity } from '../entities/Plex/plexSection.entity'
import { log } from '../lib/logger'
import mikroOrmConfig from '../mikro-orm.config'
import { PlexServer } from '../plexapi'
import { PlexMedia } from '../plexapi/PlexMedia'
import { PlexSection } from '../plexapi/PlexSection'

const url = 'https://plex.brasher.ca'
const token = 'WZYYVQg5TjrgSpP2f_J2'

const test = async () => {
  const orm = await MikroORM.init(mikroOrmConfig)

  const gen = orm.getSchemaGenerator()

  await gen.dropSchema()
  log.debug('Dropped')
  await gen.createSchema()
  log.debug('Created')

  const importer = new PlexImporter(orm.em, url, token)

  log.debug('Importing')

  await importer.import()
}

test()
  .then(() => {
    log.info('Import Complete')
    process.exit(0)
  })
  .catch((err) => {
    log.error(err)
    process.exit(1)
  })

class PlexImporter {
  constructor(
    private em: EntityManager,
    private url: string,
    private token: string
  ) {}

  async import() {
    const plex = await PlexServer.build(this.url, this.token)
    const library = await plex.getLibrary()

    // const sectionPromises = library.sections.map(
    //   async (section) => await this.importSection(section)
    // )
    // const sections = await Promise.all(sectionPromises)

    for (const section of library.sections) {
      const res = await this.importSection(section)
      await this.em.persistAndFlush(res)
    }
  }

  private async importSection(section: PlexSection) {
    log.info(`Importing ${section.title}`)
    const {
      agent,
      allowSync,
      key,
      language,
      refreshing,
      scanner,
      title,
      type,
      uuid,
    } = section

    const mediaEntities = await Promise.all(
      section.media.slice(0, 100).map((mediaItem) => this.addMedia(mediaItem))
    )

    const foundSection = await this.em.findOne(PlexSectionEntity, {
      uuid: section.uuid,
    })

    if (foundSection) {
      foundSection.assign(
        {
          agent,
          allowSync,
          key,
          language,
          refreshing,
          scanner,
          title,
          type,
          uuid,
          media: mediaEntities,
        },
        {
          mergeObjects: true,
        }
      )
      return foundSection
    }

    const newSection = this.em.create(PlexSectionEntity, {
      agent,
      allowSync,
      key,
      language,
      refreshing,
      scanner,
      title,
      type,
      uuid,
      media: mediaEntities,
    })
    return newSection
  }

  private async addMedia(media: PlexMedia) {
    const {
      guid,
      key,
      studio,
      type,
      title,
      ratingKey,
      audienceRating,
      contentRating,
      duration,
      rating,
      summary,
      tagline,
      year,
      media: mediaFiles,
    } = media

    const foundMedia = await this.em.findOne(PlexMediaEntity, { guid })
    log.debug(mediaFiles)

    if (foundMedia) {
      foundMedia.assign(
        {
          key,
          studio,
          type,
          title,
          audienceRating,
          contentRating,
          duration,
          rating,
          summary,
          tagline,
          year,
          mediaFiles,
        },
        {
          mergeObjects: true,
        }
      )
      return foundMedia
    }

    const newMovie = this.em.create(PlexMediaEntity, {
      guid,
      ratingKey,
      key,
      studio,
      type,
      title,
      audienceRating,
      contentRating,
      duration,
      rating,
      summary,
      tagline,
      year,
      mediaFiles,
    })
    return newMovie
  }
}
