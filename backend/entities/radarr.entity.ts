import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class RadarrQualityProfile {
  @Field()
  id!: number

  @Field()
  name!: string

  @Field()
  upgradeAllowed!: boolean

  @Field((type) => [RadarrLanguage])
  language!: RadarrLanguage[]
}

@ObjectType()
class RadarrLanguage {
  @Field()
  id!: number

  @Field()
  name!: string
}


export enum Availablity {
  ANNOUNCED = 'announced',
  IN_CINEMAS = 'inCinema',
  RELEASED = 'released'
}