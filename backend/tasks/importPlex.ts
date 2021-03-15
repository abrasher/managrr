import { log } from '../lib/logger'
import { PlexServer } from '../plexapi'
import { PlexLibrary, PlexSection } from '../plexapi/PlexLibrary'
import { PlexMedia } from '../plexapi/PlexMedia'
import { prisma } from '../prisma'

const url = 'https://plex.brasher.ca'
const token = 'WZYYVQg5TjrgSpP2f_J2'

const main = async () => {
  const plex = await PlexServer.build(url, token)

  const library = await plex.getLibrary()

  await addLibrary(library)
}

const addLibrary = async (library: PlexLibrary) => {
  const sections = library.sections

  const sectionsToLink: number[] = []

  // const media = await Promise.all(sections.map((section) => ))

  await addSection(sections[0])
  // for (const section of sections) {
  //   const createdSection = await addSection(section)
  //   // sectionsToLink.push(createdSection.)
  // }
}

const addSection = async (section: PlexSection) => {
  log.debug(`Importing Plex Library ${section.title} | ${section.uuid}`)

  const sectionMedia = section.media

  const mediaToLink: number[] = []

  const numMedia = sectionMedia.length

  const addedMedia = Promise.all(
    sectionMedia.map(async (media) => {
      console.log(`Adding ${media.title}`)
      const result = await addMedia(media)
      console.log(`Finished ${media.title}`)
    })
  )

  // for (const [index, mediaItem] of sectionMedia.entries()) {
  //   try {
  //     log.debug(
  //       `Importing Plex Media Item ${(index + 1)
  //         .toString()
  //         .padStart(numMedia.toString().length, '0')} / ${numMedia} ${
  //         mediaItem.title
  //       }`
  //     )
  //     const createdMedia = await addMedia(mediaItem)
  //     mediaToLink.push(createdMedia.ratingKey)
  //   } catch (error) {
  //     log.error(error)
  //     process.exit(1)
  //   }
  // }

  // const {
  //   agent,
  //   allowSync,
  //   key,
  //   language,
  //   refreshing,
  //   scanner,
  //   title,
  //   type,
  //   uuid,
  // } = section

  // return prisma.plexSection.upsert({
  //   where: {
  //     uuid: section.uuid,
  //   },
  //   create: {
  //     agent,
  //     allowSync,
  //     key,
  //     language,
  //     refreshing,
  //     scanner,
  //     title,
  //     type,
  //     uuid,
  //   },
  //   update: {},
  // })
}

const addMedia = async (media: PlexMedia) => {
  const {
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

  const mediaFileMap = (operation: 'create' | 'update') =>
    mediaFiles.map((file) => ({
      id: file.id,
      duration: file.duration,
      bitrate: file.bitrate,
      width: file.width,
      height: file.height,
      mediaPart: file.part
        ? {
            [operation]: file.part.map((part) => ({
              id: part.id,
              file: part.file,
              size: part.size,
              container: part.container,
            })),
          }
        : undefined,
    }))

  return prisma.plexMedia.upsert({
    where: {
      ratingKey,
    },
    create: {
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
      mediaFiles: {
        create: mediaFileMap('create'),
      },
    },
    update: {
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
      // mediaFiles: {
      //   update: mediaFileMap('update'),
      // },
    },
  })
}

main().catch(console.error)
