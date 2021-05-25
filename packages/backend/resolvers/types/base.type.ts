import { Field, ID, InputType } from 'type-graphql'

@InputType()
export abstract class BaseInput {
  @Field(() => ID)
  id!: string
}
