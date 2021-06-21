import jimp from 'jimp'
import { Field, InputType } from 'type-graphql'

import { TASK_NAME } from '@/backend/entities'
import { ThumbnailOptions } from '@/backend/lib/PosterGenerator'

@InputType()
export class RunTaskInput {
  @Field(() => TASK_NAME)
  taskName!: TASK_NAME
}

@InputType()
export class PosterGenerationInput implements ThumbnailOptions {
  @Field({ nullable: true })
  SOURCE_OPACITY!: number

  @Field({ nullable: true })
  DESTINATION_OPACITY!: number

  @Field(() => BlendMode, { nullable: true })
  BLEND_MODE!: BlendMode

  @Field({ nullable: true })
  SPACING!: number

  @Field({ nullable: true })
  GLOBAL_ICON_SCALE!: number

  @Field({ nullable: true })
  RATING_SCALE!: number

  @Field({ nullable: true })
  FONT_COLOUR!: 'white' | 'black'

  @Field({ nullable: true })
  IMAGE_HEIGHT!: number

  @Field({ nullable: true })
  IMAGE_WIDTH!: number

  @Field({ nullable: true })
  RATING_BOX_HEIGHT!: number

  @Field({ nullable: true })
  JPEG_QUALITY!: number

  @Field({ nullable: true })
  BOX_COLOUR!: string
}

export enum BlendMode {
  SOURCE_OVER = 'srcOver',
  DESTINATION_OVER = 'dstOver',
  MULTIPLY = 'multiply',
  ADD = 'add',
  SCREEN = 'screen',
  OVERLAY = 'overlay',
  DARKEN = 'darken',
  LIGHTEN = 'lighten',
  HARDLIGHT = 'hardLight',
  DIFFERENCE = 'difference',
  EXCLUSION = 'exclusion',
}
