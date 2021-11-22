import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

@Entity()
@ObjectType()
export class OMDbMetadata {
  @PrimaryKey() imdbId!: string

  @Property() @Field({ nullable: true }) rottenTomatoesRating!: number
  @Property() @Field() year!: number
  @Property() @Field() metascore!: number
  @Property() @Field() imdbRating!: number
  @Property() @Field() imdbVotes!: number
  @Property() @Field() rated!: string
  @Property() @Field() released!: string
  @Property() @Field() runtime!: string
  @Property() @Field() director!: string
  @Property() @Field() writer!: string
  @Property() @Field() actors!: string
  @Property() @Field() plot!: string
  @Property() @Field() language!: string
  @Property() @Field() country!: string
  @Property() @Field() awards!: string
  @Property() @Field() poster!: string
  @Property() @Field() type!: string
  @Property() @Field() dvd!: string
  @Property() @Field() boxOffice!: string
  @Property() @Field() production!: string
  @Property() @Field() website!: string
}
