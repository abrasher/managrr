import { Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { PlexInstance } from '../entities/settings.entity'
import { createBaseCRUDResolver } from './base.resolver'
import { AddPlexInstanceInput, UpdatePlexInstanceInput } from './types/settings.type'

const PlexBaseCRUDResolver = createBaseCRUDResolver(
  PlexInstance,
  AddPlexInstanceInput,
  UpdatePlexInstanceInput
)
@Service()
@Resolver((of) => PlexInstance)
export class PlexInstanceResolver extends PlexBaseCRUDResolver {}
