import { ArrayType, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'

import { RadarrInstance } from '../../system/settings.entity'
import { Media } from '../media.entity'

@Entity()
@ObjectType()
export class RadarrMetadata {
  @PrimaryKey() _id = v4()

  @Property() @Field() id!: number
  @Property() @Field() title!: string
  @Property() @Field() originalTitle!: string
  @Property() @Field() secondaryYearSourceId!: number
  @Property() @Field() sortTitle!: string
  @Property() @Field() sizeOnDisk!: number
  @Property() @Field() status!: string
  @Property() @Field() overview!: string
  @Property() @Field() inCinemas!: string
  @Property() @Field() physicalRelease!: string
  @Property() @Field() digitalRelease!: string
  @Property() @Field() website!: string
  @Property() @Field() year!: number
  @Property() @Field() hasFile!: boolean
  @Property() @Field() youTubeTrailerId!: string
  @Property() @Field() studio!: string
  @Property() @Field() path!: string
  @Property() @Field() qualityProfileId!: number
  @Property() @Field() monitored!: boolean
  @Property() @Field() minimumAvailability!: string
  @Property() @Field() isAvailable!: boolean
  @Property() @Field() folderName!: string
  @Property() @Field() runtime!: number
  @Property() @Field() cleanTitle!: string
  @Property() @Field() imdbId!: string
  @Property() @Field() tmdbId!: number
  @Property() @Field() titleSlug!: string
  @Property() @Field() certification!: string
  @Property() @Field(() => [String], { nullable: true }) tags?: string[]
  @Property() @Field() added!: string

  @Property({ type: ArrayType, nullable: true })
  @Field(() => [String])
  alternateTitles?: string[]

  // Movie File Properties
  @Property() @Field() relativePath!: string
  @Property() @Field() size!: number
  @Property() @Field() dateAdded!: string
  @Property() @Field() indexerFlags!: number
  @Property() @Field() quality!: string
  @Property() @Field() qualityCutoffNotMet!: boolean
  @Property({ nullable: true }) @Field({ nullable: true }) releaseGroup?: string
  @Property() @Field() edition!: string

  // Relationships
  @ManyToOne(() => RadarrInstance)
  instance!: RadarrInstance

  @ManyToOne(() => Media)
  media!: Media
}
