import { ObjectType, Field, Int, Float } from 'type-graphql'
import { RadarrCollection } from './RadarrCollection'
import { RadarrGenre } from './RadarrGenre'
import { RadarrMovieFile } from './RadarrMovieFile'
import { RadarrQualityProfile } from './RadarrQualityProfile'
import { RadarrRating } from './RadarrRating'
import { RadarrTag } from './RadarrTag'

@ObjectType()
export class RadarrMovie {
  @Field((type) => Int, {
    nullable: false,
  })
  id!: number

  @Field((type) => String, {
    nullable: false,
  })
  title!: string

  @Field((type) => String, {
    nullable: false,
  })
  sortTitle!: string

  @Field((type) => Float, {
    nullable: false,
  })
  sizeOnDisk!: number

  @Field((type) => String, {
    nullable: false,
  })
  overview!: string

  @Field((type) => String, {
    nullable: false,
  })
  inCinemas!: string

  @Field((type) => String, {
    nullable: false,
  })
  physicalRelease!: string

  @Field((type) => String, {
    nullable: false,
  })
  website!: string

  @Field((type) => Int, {
    nullable: false,
  })
  year!: number

  @Field((type) => Boolean, {
    nullable: false,
  })
  hasFile!: boolean

  @Field((type) => String, {
    nullable: false,
  })
  youTubeTrailerId!: string

  @Field((type) => String, {
    nullable: false,
  })
  studio!: string

  @Field((type) => String, {
    nullable: false,
  })
  path!: string

  @Field((type) => String, {
    nullable: false,
  })
  rootFolderPath!: string

  @Field((type) => Int, {
    nullable: true,
  })
  qualityProfileId?: number | null

  @Field((type) => Boolean, {
    nullable: false,
  })
  monitor!: boolean

  @Field((type) => String, {
    nullable: false,
  })
  minimumAvailablity!: string

  @Field((type) => Boolean, {
    nullable: false,
  })
  isAvailable!: boolean

  @Field((type) => String, {
    nullable: false,
  })
  folderName!: string

  @Field((type) => Int, {
    nullable: false,
  })
  runtime!: number

  @Field((type) => String, {
    nullable: false,
  })
  cleanTitle!: string

  @Field((type) => String, {
    nullable: false,
  })
  imdbId!: string

  @Field((type) => String, {
    nullable: false,
  })
  tmdbId!: string

  @Field((type) => String, {
    nullable: false,
  })
  titleSlug!: string

  @Field((type) => String, {
    nullable: false,
  })
  certification!: string

  @Field((type) => String, {
    nullable: false,
  })
  status!: string

  qualityProfile?: RadarrQualityProfile[]

  genres?: RadarrGenre[]

  tags?: RadarrTag[]

  file?: RadarrMovieFile | null

  rating?: RadarrRating[]

  collection?: RadarrCollection | null

  @Field((type) => Int, {
    nullable: true,
  })
  radarrCollectionTmdbId?: number | null
}
