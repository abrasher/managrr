import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/core'
import { Node } from 'entities'
import { Field, ObjectType, Root } from 'type-graphql'

import { PlexMediaEntity } from './Plex/plexMedia.entity'
import { RadarrQualityProfile } from './radarr.entity'
import { RadarrInstance } from './settings.entity'

@Entity()
@ObjectType({ implements: Node })
export class Genre extends Node<Genre> {
  @Property()
  @Field()
  name!: string

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies = new Collection<Movie>(this)
}

@Entity()
@ObjectType({ implements: Node })
export class Movie extends Node<Movie> {
  @Property()
  @Field()
  title!: string

  @Property()
  @Field({ nullable: true })
  year!: number

  @Unique()
  @Property()
  @Field()
  tmdbId?: number

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
@ObjectType({ implements: Node })
export class RadarrFile extends Node<RadarrFile> {
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
  qualityProfileId!: number

  @Field(() => RadarrQualityProfile)
  qualityProfile(@Root() radarrFile: RadarrFile): RadarrQualityProfile {
    this.instance.apiKey
    return {
      id: 1,
      language: [
        {
          id: 1,
          name: 'english',
        },
      ],
      name: 'profile1',
      upgradeAllowed: false,
    }
  }

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
