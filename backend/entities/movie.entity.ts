import {
  BaseEntity,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

import { PlexMediaEntity } from './Plex/plexMedia.entity'
import { RadarrInstance } from './settings.entity'

@Entity()
@ObjectType()
export class Genre extends BaseEntity<Genre, 'id'> {
  @PrimaryKey()
  id!: number

  @Property()
  @Field()
  name!: string

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies = new Collection<Movie>(this)
}

@Entity()
@ObjectType()
export class Movie extends BaseEntity<Movie, 'id'> {
  @PrimaryKey()
  @Field()
  id?: number

  @Property()
  @Field()
  title!: string

  @Property()
  @Field()
  year!: number

  @Property()
  @Field()
  duration!: number

  @Property()
  @Field({ nullable: true })
  studio?: string

  @Property()
  @Field({ nullable: true })
  contentRating?: string

  @ManyToMany(() => Genre)
  @Field((type) => [Genre])
  genres = new Collection<Genre>(this)

  @OneToMany(() => PlexMediaEntity, (media) => media.movie)
  @Field(() => [PlexMediaEntity])
  plexMedia = new Collection<PlexMediaEntity>(this)

  @OneToMany(() => RadarrFile, (file) => file.movie)
  @Field(() => [RadarrFile])
  radarrs = new Collection<RadarrFile>(this)
}

@Entity()
@ObjectType()
export class RadarrFile {
  @PrimaryKey()
  id!: number

  @Field(() => RadarrInstance)
  @ManyToOne(() => RadarrInstance)
  instance!: RadarrInstance

  @Property()
  @Field()
  monitored!: boolean

  @Property()
  @Field()
  hasFile!: boolean

  @Property()
  tmdbId!: number

  @Property({ nullable: true })
  imdbId?: string

  @ManyToOne()
  movie!: Movie
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
