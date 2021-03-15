import { Field, ID, InputType } from 'type-graphql'

@InputType()
export class UpdateUserSharingInput {
  @Field((type) => ID, { description: 'Plex User ID' })
  id!: string

  @Field((type) => [UpdateUserSharedServerInput])
  servers!: UpdateUserSharedServerInput[]
}

@InputType()
class UpdateUserSharedServerInput {
  @Field()
  machineIdentifier!: string

  @Field()
  allLibraries!: boolean

  @Field((type) => [ID])
  librarySectionIds!: string[]
}
