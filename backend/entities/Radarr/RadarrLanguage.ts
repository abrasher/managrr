import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class RadarrLanguage {
  @Field((type) => Int, {
    nullable: false,
  })
  id!: number

  @Field((type) => String, {
    nullable: false,
  })
  name!: string
}
