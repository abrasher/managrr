import { Field, InputType } from 'type-graphql'

@InputType()
export class UserLoginInput {
  @Field()
  username!: string

  @Field()
  password!: string
}
