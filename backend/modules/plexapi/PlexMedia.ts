import { AxiosInstance } from 'axios'

export class PlexMedia implements IPlexMedia {
  api: AxiosInstance
  ratingKey: number
  key: string
  studio?: string
  type: string
  title: string
  contentRating?: string
  summary: string
  rating?: number
  audienceRating?: number
  year: number
  tagline?: string
  duration: number
  guid!: string
  art: string
  media: IMedia[]
  genre: { tag: string }[]
  director: { tag: string }[]
  writer: { tag: string }[]
  country: { tag: string }[]
  role: { tag: string }[]
  constructor(api: AxiosInstance, data: IPlexMedia) {
    this.api = api
    this.guid = data.guid
    this.ratingKey = Number(data.ratingKey)
    this.key = data.key
    this.studio = data.studio
    this.type = data.type
    this.title = data.title
    this.contentRating = data.contentRating
    this.summary = data.summary
    this.rating = data.rating
    this.audienceRating = data.audienceRating
    this.year = data.year
    this.tagline = data.tagline
    this.duration = data.duration
    this.art = data.art
    this.media = data.media
    this.genre = data.genre
    this.director = data.director
    this.writer = data.writer
    this.country = data.country
    this.role = data.role
  }
  async getIds(): Promise<{
    imdbId?: string
    tmdbId?: number
    tvdbId?: string
  }> {
    const { data } = await this.api.get<Metadata>(this.key)
    const guid = data.mediaContainer.metadata[0].guid

    // If library if from old scanner or TMDB
    if (typeof guid === 'string') {
      const regMatch = /com\.plexapp\.agents\.(\w*):\/\/([\w\d]*)/

      const match = regMatch.exec(guid)
      if (match) {
        const [_, agent, id] = match
        if (agent === 'imdb') {
          return {
            imdbId: id,
          }
        }
        if (agent === 'themoviedb') {
          return {
            tmdbId: id,
          }
        }
      }
      return {}
    }
    const ids = guid.map((item) => item.id)

    const getId = (source: string) => {
      const result = ids?.find((id) => id.includes(source))

      return result?.split('://')[1]
    }

    return {
      imdbId: getId('imdb'),
      tmdbId: getId('tmdb'),
      tvdbId: getId('tvdb'),
    }
  }
}

type Metadata = {
  mediaContainer: {
    metadata: [
      {
        guid:
          | {
              id: string
            }[]
          | string
      }
    ]
  }
}

export interface IPlexMedia {
  guid: string
  ratingKey: number
  key: string
  studio?: string
  type: string
  title: string
  contentRating?: string
  summary: string
  rating?: number
  audienceRating?: number
  year: number
  tagline?: string
  duration: number
  art: string
  media: IMedia[]
  genre: Array<{ tag: string }>
  director: Array<{ tag: string }>
  writer: Array<{ tag: string }>
  country: Array<{ tag: string }>
  role: Array<{ tag: string }>
}

interface IMedia {
  id: number
  duration?: number
  bitrate?: number
  width?: number
  height?: number
  aspectRatio: number
  audioCHannels: number
  audioCodec: string
  videoCodec: string
  videoResolution: number
  container: string
  videoFrameRate: string
  part: IMediaPart[]
}

interface IMediaPart {
  id: number
  key: string
  duration: number
  file: string
  size: number
  container?: string
}
