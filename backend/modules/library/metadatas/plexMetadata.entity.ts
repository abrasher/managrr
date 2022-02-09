import { DateType, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'
import { v4 } from 'uuid'

import { PlexInstance } from '../../system/settings.entity'
import { Media } from '../media.entity'

@Entity()
@ObjectType()
export class PlexMetadata {
  @PrimaryKey() id = v4()

  @Property() @Field() librarySectionTitle!: string
  @Property() @Field() librarySectionKey!: string
  @Property() @Field() librarySectionUUID!: string
  @Property() @Field() type!: string
  @Property() @Field() title!: string
  @Property() @Field() originallyAvailableAt!: string
  @Property() @Field() thumb!: string
  @Property() @Field() ratingKey!: string
  @Property() @Field() librarySectionID!: number

  @Property({ type: DateType }) @Field() addedAt!: Date
  @Property({ type: DateType }) @Field() updatedAt!: Date
  @Property({ type: DateType }) @Field() createdAt!: Date

  @ManyToOne(() => PlexInstance)
  plexInstance!: PlexInstance

  @ManyToOne(() => Media)
  media!: Media

  async edit(payload: {
    [K in keyof PlexMetadata]: { locked: 0 | 1; value: PlexMetadata[K] }
  }): Promise<void> {
    const { client } = this.plexInstance.api

    await client.put(`library/${this.librarySectionID}/all`, null, {
      params: {
        ...payload,
        id: this.ratingKey,
      },
    })
  }
}
