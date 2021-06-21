import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class System {
  @Field()
  version!: string

  @Field(() => [Task])
  tasks!: Task[]
}

@ObjectType()
export class Task {
  @Field(() => TASK_NAME)
  name!: TASK_NAME

  @Field({ nullable: true })
  started?: number

  @Field({ nullable: true })
  completed?: number

  @Field(() => TASK_STATUS)
  status!: TASK_STATUS
}

export enum TASK_NAME {
  'importer' = 'Importer',
  'thumbnail_generate' = 'Poster Generator',
  'restore_poster' = 'Restore Posters',
}

export enum TASK_STATUS {
  'running',
  'finished',
  'not_started',
  'errored',
}
