import { Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { RadarrInstance } from '../entities/settings.entity'
import { createBaseCRUDResolver } from './base.resolver'
import { AddRadarrInstanceInput, UpdateRadarrInstanceInput } from './types/settings.type'

const RadarrBaseCRUDResolver = createBaseCRUDResolver(RadarrInstance, AddRadarrInstanceInput, UpdateRadarrInstanceInput)

@Service()
@Resolver((of) => RadarrInstance)
export class RadarrResolver extends RadarrBaseCRUDResolver {}
