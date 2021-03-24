import { EntityManager } from '@mikro-orm/sqlite'
import { Service } from 'typedi'

import { MovieImporter } from '../tasks/importMovie'

const state = {
  store: {} as Store,
}
