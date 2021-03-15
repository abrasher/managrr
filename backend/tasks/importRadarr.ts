import {
  PrismaClient,
  RadarrAlternateTitle,
  RadarrMovie,
  RadarrQualityProfile,
  RadarrMovieFile,
  RadarrTag,
  RadarrMediaInfo,
} from '@prisma/client'

import axios from 'axios'
import { RadarrLanguage } from '../entities/Radarr/RadarrLanguage'

const prisma = new PrismaClient()

const url = 'https://radarr.brasher.ca/api/v3'
const apiKey = '91ce1fb5aebf49459838770d20f17151'

const api = axios.create({
  baseURL: url,
  headers: {
    'X-Api-Key': apiKey,
  },
})

const addQualityProfiles = async () => {
  const res = await api.get<RadarrQualityProfile[]>('/qualityProfile')

  const promises = res.data.map((profile) => {
    console.log('Adding Quality Profile')
    return prisma.radarrQualityProfile.upsert({
      where: { id: profile.id },
      update: {
        name: profile.name,
      },
      create: {
        id: profile.id,
        name: profile.name,
      },
    })
  })
  await Promise.all(promises)
}

const addTags = async () => {
  const res = await api.get<RadarrTag[]>('/tag')

  console.log(`Upserting ${res.data.length} tags`)
  const promises = res.data.map(({ id, label }) =>
    prisma.radarrTag.upsert({
      where: {
        id,
      },
      update: {
        label,
      },
      create: {
        id,
        label,
      },
    })
  )
  await Promise.all(promises)
}

interface MovieFileData extends Omit<RadarrMovieFile, 'quality'> {
  mediaInfo?: Omit<RadarrMediaInfo, 'movieFileId' | 'movieFile' | 'languages'>
  languages: RadarrLanguage[]
  quality: {
    quality: {
      id: number
      name: string
    }
  }
}

interface AlternateTitleData extends RadarrAlternateTitle {
  language: RadarrLanguage
}

interface MovieData
  extends Omit<
    RadarrMovie,
    'radarrQualityProfileId' | 'radarrCollectionTmdbId'
  > {
  images: Array<{ type: 'poster' | 'fanart'; url: string }>
  genres: string[]
  tags: number[]
  qualityProfileId: number
  ratings: { votes: number; value: number }
  alternateTitles: AlternateTitleData[] | null
  movieFile: MovieFileData
  collection: {
    name: string
    tmdb: number
  } | null
}

const main = async () => {
  await addTags()
  await addQualityProfiles()
}

main()
  .then(() => {
    console.log('done')
  })
  .catch((err) => console.error(err))

const addMovie = async (result: MovieData) => {
  console.log(`Add / Updating Movie: ${result.title}`)
  const {
    images,
    genres: genresData,
    tags: tagsData,
    ratings,
    collection,
    id,
    qualityProfileId,
    alternateTitles,
    movieFile,
    ...data
  } = result

  const { movieId, languages, quality, ...movieFileData } = movieFile

  const tagsMap = tagsData.map((id) => ({ id }))

  const genres = genresData.length
    ? {
        connectOrCreate: genresData.map((genre) => ({
          where: {
            name: genre,
          },
          create: {
            name: genre,
          },
        })),
      }
    : undefined

  const movieFileLangauges = languages.length
    ? {
        connectOrCreate: languages.map((language) => ({
          where: {
            id: language.id,
          },
          create: {
            id: language.id,
            name: language.name,
          },
        })),
      }
    : undefined

  return prisma.radarrMovie.upsert({
    where: { id: id },
    create: {
      ...data,
      id,
      alternateTitles: {
        create: alternateTitles?.map((altTitle) => {
          const { movieId, language, ...altTitleData } = altTitle
          return {
            ...altTitleData,
            language: {
              connectOrCreate: {
                where: {
                  id: language.id,
                },
                create: {
                  id: language.id,
                  name: language.name,
                },
              },
            },
          }
        }),
      },
      tags: {
        connect: tagsMap,
      },
      genres,
      qualityProfile: {
        connect: { id: qualityProfileId },
      },
      ratings: {
        create: {
          value: ratings.value,
          votes: ratings.votes,
        },
      },
      movieFile: {
        create: {
          ...movieFileData,
          languages: movieFileLangauges,
          mediaInfo: movieFile.mediaInfo
            ? { create: { ...movieFile.mediaInfo } }
            : undefined,
          quality: quality.quality.name,
        },
      },
    },
    update: {
      ...data,
      movieFile: {
        update: {
          ...movieFileData,
          languages: movieFileLangauges,
          quality: quality.quality.name,
          mediaInfo: movieFile.mediaInfo
            ? {
                upsert: {
                  create: {
                    ...movieFile.mediaInfo,
                  },
                  update: {
                    ...movieFile.mediaInfo,
                  },
                },
              }
            : undefined,
        },
      },
      ratings: {
        update: {
          value: ratings.value,
          votes: ratings.votes,
        },
      },
      tags: {
        set: tagsMap,
      },
    },
    // include: {
    //   genres: true,
    // },
  })
}

// const ENDPOINTS = {
//   DOWNLOADCLIENT: '/downloadclient',
// }
