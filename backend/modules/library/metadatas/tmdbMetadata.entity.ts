import { ArrayType, Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, ObjectType } from 'type-graphql'

@Entity()
@ObjectType()
export class TMDBMetadata {
  @PrimaryKey() @Field() id!: number
  @Property() @Field() adult!: boolean
  @Property() @Field() backdrop_path!: string
  @Property() @Field() budget!: number
  @Property() @Field() homepage!: string
  @Property() @Field() imdb_id!: string
  @Property() @Field() original_language!: string
  @Property() @Field() original_title!: string
  @Property() @Field() overview!: string
  @Property() @Field() popularity!: number
  @Property() @Field() poster_path!: string
  @Property() @Field() release_date!: string
  @Property() @Field() revenue!: number
  @Property() @Field() runtime!: number
  @Property() @Field() status!: string
  @Property() @Field() tagline!: string
  @Property() @Field() title!: string
  @Property() @Field() video!: boolean
  @Property() @Field() vote_average!: number
  @Property() @Field() vote_count!: number

  @Property({ type: ArrayType })
  @Field(() => [String])
  genres!: string[]

  @Property({ type: ArrayType })
  @Field(() => [String])
  production_companies_names!: string[]

  @Property({ type: ArrayType })
  @Field(() => [String])
  production_countries_iso!: string[]

  @Property({ type: ArrayType })
  @Field(() => [String])
  spoken_languages_iso!: string[]
}
