import { RadarrMovie } from './RadarrMovie'
import { RadarrQuality } from './RadarrQuality'
import { ObjectType, Field, Int, Float } from 'type-graphql'

@ObjectType()
export class RadarrMovieFile {
  @Field((type) => Int, {
    nullable: false,
  })
  id!: number

  @Field((type) => String, {
    nullable: false,
  })
  relativePath!: string

  @Field((type) => String, {
    nullable: false,
  })
  path!: string

  @Field((type) => Float, {
    nullable: false,
  })
  size!: number

  @Field((type) => Date, {
    nullable: false,
  })
  dateAdded!: Date

  @Field((type) => Int, {
    nullable: false,
  })
  indexerFlags!: number

  quality?: RadarrQuality[]

  @Field((type) => Boolean, {
    nullable: false,
  })
  qualityCutoffNotMet!: boolean

  @Field((type) => String, {
    nullable: false,
  })
  audioAdditionalFeatures!: string

  @Field((type) => Float, {
    nullable: false,
  })
  audioBitrate!: number

  @Field((type) => Float, {
    nullable: false,
  })
  audioChannels!: number

  @Field((type) => String, {
    nullable: false,
  })
  audioCodec!: string

  @Field((type) => String, {
    nullable: false,
  })
  audioLanguages!: string

  @Field((type) => Float, {
    nullable: false,
  })
  audioStreamCount!: number

  @Field((type) => Float, {
    nullable: false,
  })
  videoBitDepth!: number

  @Field((type) => Float, {
    nullable: false,
  })
  videoBitrate!: number

  @Field((type) => Int, {
    nullable: false,
  })
  videoFps!: number

  @Field((type) => String, {
    nullable: false,
  })
  resolution!: string

  @Field((type) => String, {
    nullable: false,
  })
  runTime!: string

  @Field((type) => String, {
    nullable: false,
  })
  scanType!: string

  @Field((type) => String, {
    nullable: false,
  })
  subtitles!: string

  @Field((type) => String, {
    nullable: false,
  })
  releaseGroup!: string

  movie?: RadarrMovie

  @Field((type) => Int, {
    nullable: false,
  })
  movieId!: number
}
