import { Field, ObjectType } from 'type-graphql'

@ObjectType()
class AlternateTitle {
  @Field()
  name!: string

  @Field()
  language!: string
}

@ObjectType()
class Person {
  id!: number

  @Field()
  name!: string

  @Field()
  age!: number
}

@ObjectType()
export class Genre {
  id!: number

  @Field()
  name!: string
}

@ObjectType()
export class Movie {
  @Field()
  id!: number

  @Field()
  title!: string

  //@Field((type) => [AlternateTitle])
  //alternateTitles?: AlternateTitle[]

  @Field()
  year!: number

  @Field()
  duration!: number

  @Field()
  studio!: string

  @Field()
  contentRating!: string

  @Field((type) => [MovieFile])
  files?: MovieFile[]

  @Field((type) => [Genre])
  genres!: Genre[]

  @Field((type) => [PlexSection])
  plexSections?: PlexSection[]

  @Field((type) => [PlexCollection])
  plexCollections?: PlexCollection[]

  @Field()
  totalFileSize!: number
}

@ObjectType()
export class PlexCollection {
  @Field()
  title!: string

  @Field()
  summary!: string

  @Field()
  contentRating!: string

  @Field()
  poster!: string

  @Field()
  background!: string

  @Field((type) => CollectionMode)
  mode!: CollectionMode

  @Field((type) => CollectionOrder)
  order!: CollectionOrder
}

@ObjectType()
export class MovieFile {
  @Field()
  radarrInstance!: string

  @Field()
  monitored!: string

  @Field()
  size?: number

  @Field()
  path!: string
}

@ObjectType()
export class PlexMovie {
  @Field()
  libraryId!: number

  @Field()
  libraryName!: string
}

@ObjectType()
class PlexSection {
  @Field()
  name!: string

  @Field((type) => LibraryType)
  type!: LibraryType
}

export enum LibraryType {
  MOVIE = 'movie',
  SHOW = 'show',
}

export enum CollectionMode {
  DEFAULT = 'default',
  HIDEITEMS = 'hideItems',
  HIDECOLLECTION = 'hideCollection',
  SHOW = 'show',
}

export enum CollectionOrder {
  RELEASEDATE = 'releaseDate',
  ALPHABETICAL = 'alphabetical',
}
