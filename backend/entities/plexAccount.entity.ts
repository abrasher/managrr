import { Field, ID, InterfaceType, ObjectType, registerEnumType } from 'type-graphql'

import type {
  IPlexAccount,
  IPlexSharedLibrary,
  IPlexSharedServer,
  IPlexUser,
} from '../modules/plexapi'
import { LibraryType } from '../modules/plexapi'
import { IPlexDevice } from '../modules/plexapi/PlexAccount'

registerEnumType(LibraryType, {
  name: 'LibraryType',
  description: 'Type of library (movie, show, photo, music)',
})

@ObjectType({ description: 'Plex Account Model' })
export class PlexAccount implements IPlexAccount {
  @Field((type) => ID)
  id!: string

  @Field()
  username!: string

  @Field()
  uuid!: string

  @Field()
  email!: string

  @Field()
  token!: string

  @Field((type) => [PlexUser])
  users!: PlexUser[]

  @Field((type) => [PlexDevice])
  devices?: PlexDevice[]

  @Field((type) => [PlexDeviceServer])
  servers?: PlexDeviceServer[]
}

@ObjectType()
export class PlexUser implements IPlexUser {
  @Field((type) => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  username!: string

  @Field()
  recommendationsPlaylistId!: string

  @Field()
  thumb!: string

  @Field()
  protected!: boolean

  @Field()
  home!: boolean

  @Field()
  allowTuners!: boolean

  @Field()
  allowSync!: boolean

  @Field()
  allowChannels!: boolean

  @Field()
  allowCameraUpload!: boolean

  @Field()
  allowSubtitleAdmin!: boolean

  @Field()
  filterAll!: boolean

  @Field()
  filterMovies!: boolean

  @Field()
  filterMusic!: boolean

  @Field()
  filterPhotos!: boolean

  @Field()
  filterTelevision!: boolean

  @Field()
  email!: string

  @Field((type) => [PlexSharedServer])
  sharedServers?: PlexSharedServer[]
}

@ObjectType()
class PlexSharedServer implements IPlexSharedServer {
  @Field((type) => ID)
  id!: string

  @Field()
  name!: string

  @Field()
  ownerId!: number

  @Field()
  invitedId!: number

  @Field()
  invitedEmail!: string

  @Field()
  serverId!: number

  @Field()
  accepted!: boolean

  @Field()
  acceptedAt!: Date

  @Field()
  deletedAt!: Date

  @Field()
  leftAt!: Date

  @Field()
  owned!: boolean

  @Field()
  inviteToken!: string

  @Field()
  machineIdentifier!: string

  @Field()
  lastSeenAt!: Date

  @Field()
  numLibraries!: number

  @Field()
  allLibraries!: boolean

  @Field((type) => [PlexSharedLibrary])
  libraries?: PlexSharedLibrary[]
}

@ObjectType()
class PlexSharedLibrary implements IPlexSharedLibrary {
  @Field((type) => ID)
  id!: string

  @Field()
  key!: number

  @Field()
  title!: string

  @Field((type) => LibraryType)
  type!: LibraryType
}

@InterfaceType()
abstract class AbsPlexDevice implements IPlexDevice {
  @Field()
  name!: string

  @Field()
  publicAddress!: string

  @Field()
  product!: string

  @Field()
  productVersion!: string

  @Field()
  platform!: string

  @Field()
  platformVersion!: string

  @Field()
  device!: string

  @Field()
  model!: string

  @Field()
  vendor!: string

  @Field()
  provides!: string

  @Field()
  clientIdentifier!: string

  @Field()
  version!: string

  @Field()
  id!: string

  @Field()
  token!: string

  @Field()
  createdAt!: Date

  @Field()
  lastSeenAt!: Date

  @Field((type) => [PlexDeviceConnection])
  connection?: PlexDeviceConnection[]
}

@ObjectType()
class PlexDeviceConnection {
  @Field()
  uri!: string
}

@ObjectType({ implements: AbsPlexDevice })
export class PlexDevice extends AbsPlexDevice {}

@ObjectType({ implements: AbsPlexDevice })
export class PlexDeviceServer extends AbsPlexDevice {
  @Field((type) => [PlexSharedLibrary])
  libraries!: PlexSharedLibrary[]
}
