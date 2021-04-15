import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any
}

export type Node = {
  id: Scalars['ID']
}

/** Type of library (movie, show, photo, music) */
export enum LibraryType {
  Movie = 'MOVIE',
  Photo = 'PHOTO',
  Show = 'SHOW',
  Artist = 'ARTIST',
}

export type RadarrQualityProfile = {
  id: Scalars['Float']
  name: Scalars['String']
  upgradeAllowed: Scalars['Boolean']
  language: Array<RadarrLanguage>
}

export type RadarrLanguage = {
  id: Scalars['Float']
  name: Scalars['String']
}

/** Plex Account Model */
export type PlexAccount = {
  id: Scalars['ID']
  username: Scalars['String']
  uuid: Scalars['String']
  email: Scalars['String']
  token: Scalars['String']
  users: Array<PlexUser>
  devices: Array<PlexDevice>
  servers: Array<PlexDeviceServer>
}

export type PlexUser = {
  id: Scalars['ID']
  title: Scalars['String']
  username: Scalars['String']
  recommendationsPlaylistId: Scalars['String']
  thumb: Scalars['String']
  protected: Scalars['Boolean']
  home: Scalars['Boolean']
  allowTuners: Scalars['Boolean']
  allowSync: Scalars['Boolean']
  allowChannels: Scalars['Boolean']
  allowCameraUpload: Scalars['Boolean']
  allowSubtitleAdmin: Scalars['Boolean']
  filterAll: Scalars['Boolean']
  filterMovies: Scalars['Boolean']
  filterMusic: Scalars['Boolean']
  filterPhotos: Scalars['Boolean']
  filterTelevision: Scalars['Boolean']
  email: Scalars['String']
  sharedServers: Array<PlexSharedServer>
}

export type PlexSharedServer = {
  id: Scalars['ID']
  name: Scalars['String']
  ownerId: Scalars['Float']
  invitedId: Scalars['Float']
  invitedEmail: Scalars['String']
  serverId: Scalars['Float']
  accepted: Scalars['Boolean']
  acceptedAt: Scalars['DateTime']
  deletedAt: Scalars['DateTime']
  leftAt: Scalars['DateTime']
  owned: Scalars['Boolean']
  inviteToken: Scalars['String']
  machineIdentifier: Scalars['String']
  lastSeenAt: Scalars['DateTime']
  numLibraries: Scalars['Float']
  allLibraries: Scalars['Boolean']
  libraries: Array<PlexSharedLibrary>
}

export type PlexSharedLibrary = {
  id: Scalars['ID']
  key: Scalars['Float']
  title: Scalars['String']
  type: LibraryType
}

export type PlexDeviceConnection = {
  uri: Scalars['String']
}

export type PlexDevice = AbsPlexDevice & {
  name: Scalars['String']
  publicAddress: Scalars['String']
  product: Scalars['String']
  productVersion: Scalars['String']
  platform: Scalars['String']
  platformVersion: Scalars['String']
  device: Scalars['String']
  model: Scalars['String']
  vendor: Scalars['String']
  provides: Scalars['String']
  clientIdentifier: Scalars['String']
  version: Scalars['String']
  id: Scalars['String']
  token: Scalars['String']
  createdAt: Scalars['DateTime']
  lastSeenAt: Scalars['DateTime']
  connection: Array<PlexDeviceConnection>
}

export type PlexDeviceServer = AbsPlexDevice & {
  name: Scalars['String']
  publicAddress: Scalars['String']
  product: Scalars['String']
  productVersion: Scalars['String']
  platform: Scalars['String']
  platformVersion: Scalars['String']
  device: Scalars['String']
  model: Scalars['String']
  vendor: Scalars['String']
  provides: Scalars['String']
  clientIdentifier: Scalars['String']
  version: Scalars['String']
  id: Scalars['String']
  token: Scalars['String']
  createdAt: Scalars['DateTime']
  lastSeenAt: Scalars['DateTime']
  connection: Array<PlexDeviceConnection>
  libraries: Array<PlexSharedLibrary>
}

export type AbsPlexDevice = {
  name: Scalars['String']
  publicAddress: Scalars['String']
  product: Scalars['String']
  productVersion: Scalars['String']
  platform: Scalars['String']
  platformVersion: Scalars['String']
  device: Scalars['String']
  model: Scalars['String']
  vendor: Scalars['String']
  provides: Scalars['String']
  clientIdentifier: Scalars['String']
  version: Scalars['String']
  id: Scalars['String']
  token: Scalars['String']
  createdAt: Scalars['DateTime']
  lastSeenAt: Scalars['DateTime']
  connection: Array<PlexDeviceConnection>
}

export type UpdateMovieInput = {
  id: Scalars['ID']
  year: Scalars['Float']
  radarrs: Array<UpdateRadarrFileInput>
}

export type UpdateRadarrFileInput = {
  id: Scalars['ID']
  monitored?: Maybe<Scalars['Boolean']>
  search?: Maybe<Scalars['Boolean']>
}

export type AddMovieToRadarrInput = {
  movieId: Scalars['Float']
  radarrUrl: Scalars['String']
  monitored: Scalars['Boolean']
  qualityProfileId: Scalars['Float']
  search: Scalars['Boolean']
  minimumAvailability: RadarrAvailability
  tags: Array<Scalars['Float']>
}

export enum RadarrAvailability {
  Announced = 'ANNOUNCED',
  InCinemas = 'IN_CINEMAS',
  Released = 'RELEASED',
}

export type BaseInput = {
  id: Scalars['ID']
}

export type AddPlexInstanceInput = {
  /** URL of the Plex Server */
  url: Scalars['String']
  /** Token for the Plex Server */
  token: Scalars['String']
}

export type UpdatePlexInstanceInput = {
  id: Scalars['ID']
  url: Scalars['String']
  token: Scalars['String']
}

export type UpdateSettingsInput = {
  id: Scalars['ID']
  port?: Maybe<Scalars['Float']>
  plexAccountToken?: Maybe<Scalars['String']>
  language?: Maybe<Scalars['String']>
}

export type AddRadarrInstanceInput = {
  url: Scalars['String']
  apiKey: Scalars['String']
  instanceName: Scalars['String']
}

export type UpdateRadarrInstanceInput = {
  id: Scalars['ID']
  url: Scalars['String']
  apiKey: Scalars['String']
  instanceName: Scalars['String']
}

export type UpdateUserSharingInput = {
  /** Plex User ID */
  id: Scalars['ID']
  servers: Array<UpdateUserSharedServerInput>
}

export type UpdateUserSharedServerInput = {
  machineIdentifier: Scalars['String']
  allLibraries: Scalars['Boolean']
  librarySectionIds: Array<Scalars['ID']>
}

export type Settings = Node & {
  id: Scalars['ID']
  language: Scalars['String']
  plexAccountToken?: Maybe<Scalars['String']>
  port: Scalars['Float']
}

export type PlexInstance = Node & {
  id: Scalars['ID']
  machineIdentifier: Scalars['String']
  /** Server name set by the owner */
  friendlyName: Scalars['String']
  url: Scalars['String']
  token: Scalars['String']
  sections: Array<PlexSection>
}

export type RadarrInstance = Node & {
  id: Scalars['ID']
  url: Scalars['String']
  apiKey: Scalars['String']
  instanceName: Scalars['String']
}

export type PlexSection = Node & {
  id: Scalars['ID']
  uuid: Scalars['String']
  title: Scalars['String']
  key: Scalars['Float']
  server: PlexInstance
  type: LibraryType
}

export type PlexMedia = Node & {
  id: Scalars['ID']
  ratingKey: Scalars['Float']
  section: PlexSection
}

export type Genre = Node & {
  id: Scalars['ID']
  name: Scalars['String']
}

export type Movie = Node & {
  id: Scalars['ID']
  title: Scalars['String']
  year?: Maybe<Scalars['Float']>
  tmdbId: Scalars['Float']
  duration: Scalars['Float']
  studio?: Maybe<Scalars['String']>
  contentRating?: Maybe<Scalars['String']>
  genres: Array<Genre>
  plexMedia: Array<PlexMedia>
  radarrs: Array<RadarrFile>
}

export type RadarrFile = Node & {
  id: Scalars['ID']
  instance: RadarrInstance
  monitored: Scalars['Boolean']
  hasFile: Scalars['Boolean']
  qualityProfile: RadarrQualityProfile
}

export type User = Node & {
  id: Scalars['ID']
  username: Scalars['String']
  settings: Settings
}

export type Query = {
  movie: Movie
  movies: Array<Movie>
  node?: Maybe<Node>
  nodes?: Maybe<Array<Node>>
  plexInstance: PlexInstance
  plexInstances: Array<PlexInstance>
  account: PlexAccount
  radarrInstance: RadarrInstance
  radarrInstances: Array<RadarrInstance>
  settings: Settings
  importMovies: Scalars['String']
  taskState: Scalars['String']
  users: Array<User>
}

export type QueryNodeArgs = {
  id: Scalars['ID']
}

export type QueryNodesArgs = {
  ids: Array<Scalars['ID']>
}

export type QueryImportMoviesArgs = {
  machineIdentifier: Scalars['String']
}

export type Mutation = {
  addMovie: Movie
  updateMovie: Movie
  addMovieToRadarr: Movie
  searchMovieRadarr: Scalars['String']
  addPlexInstance: PlexInstance
  upsertPlexInstance: PlexInstance
  updatePlexInstance?: Maybe<PlexInstance>
  removePlexInstance?: Maybe<PlexInstance>
  updateUsers: Array<PlexUser>
  addRadarrInstance: RadarrInstance
  upsertRadarrInstance: RadarrInstance
  updateRadarrInstance?: Maybe<RadarrInstance>
  removeRadarrInstance?: Maybe<RadarrInstance>
  updateSettings: Settings
}

export type MutationUpdateMovieArgs = {
  data: UpdateMovieInput
}

export type MutationAddMovieToRadarrArgs = {
  data: AddMovieToRadarrInput
}

export type MutationSearchMovieRadarrArgs = {
  radarrUrl: Scalars['String']
  id: Scalars['Float']
}

export type MutationAddPlexInstanceArgs = {
  input: AddPlexInstanceInput
}

export type MutationUpsertPlexInstanceArgs = {
  input: UpsertPlexInstanceInput
}

export type MutationUpdatePlexInstanceArgs = {
  input: UpdatePlexInstanceInput
}

export type MutationRemovePlexInstanceArgs = {
  input: RemovePlexInstanceInput
}

export type MutationUpdateUsersArgs = {
  input: Array<UpdateUserSharingInput>
}

export type MutationAddRadarrInstanceArgs = {
  input: AddRadarrInstanceInput
}

export type MutationUpsertRadarrInstanceArgs = {
  input: UpsertRadarrInstanceInput
}

export type MutationUpdateRadarrInstanceArgs = {
  input: UpdateRadarrInstanceInput
}

export type MutationRemoveRadarrInstanceArgs = {
  input: RemoveRadarrInstanceInput
}

export type MutationUpdateSettingsArgs = {
  input: UpdateSettingsInput
}

export type UpsertPlexInstanceInput = {
  /** URL of the Plex Server */
  url: Scalars['String']
  /** Token for the Plex Server */
  token: Scalars['String']
  id?: Maybe<Scalars['ID']>
}

export type RemovePlexInstanceInput = {
  id: Scalars['ID']
}

export type UpsertRadarrInstanceInput = {
  url: Scalars['String']
  apiKey: Scalars['String']
  instanceName: Scalars['String']
  id?: Maybe<Scalars['ID']>
}

export type RemoveRadarrInstanceInput = {
  id: Scalars['ID']
}

export type UserFieldsFragment = Pick<PlexUser, 'id' | 'title'> & {
  sharedServers: Array<
    Pick<PlexSharedServer, 'id' | 'machineIdentifier' | 'allLibraries'> & {
      libraries: Array<Pick<PlexSharedLibrary, 'id'>>
    }
  >
}

export type RemovePlexInstanceMutationVariables = Exact<{
  input: RemovePlexInstanceInput
}>

export type RemovePlexInstanceMutation = { removePlexInstance?: Maybe<PlexFieldsFragment> }

export type UpsertPlexInstanceMutationVariables = Exact<{
  input: UpsertPlexInstanceInput
}>

export type UpsertPlexInstanceMutation = { upsertPlexInstance: PlexFieldsFragment }

export type PlexFieldsFragment = Pick<
  PlexInstance,
  'id' | 'friendlyName' | 'machineIdentifier' | 'token' | 'url'
>

export type UpsertRadarrInstanceMutationVariables = Exact<{
  input: UpsertRadarrInstanceInput
}>

export type UpsertRadarrInstanceMutation = { upsertRadarrInstance: RadarrFieldsFragment }

export type RemoveRadarrInstanceMutationVariables = Exact<{
  input: RemoveRadarrInstanceInput
}>

export type RemoveRadarrInstanceMutation = { removeRadarrInstance?: Maybe<RadarrFieldsFragment> }

export type RadarrFieldsFragment = Pick<RadarrInstance, 'id' | 'instanceName' | 'url' | 'apiKey'>

export type UpdateSettingsMutationVariables = Exact<{
  input: UpdateSettingsInput
}>

export type UpdateSettingsMutation = {
  updateSettings: Pick<Settings, 'id' | 'language' | 'port' | 'plexAccountToken'>
}

export type UpdateUsersMutationVariables = Exact<{
  input: Array<UpdateUserSharingInput> | UpdateUserSharingInput
}>

export type UpdateUsersMutation = { updateUsers: Array<UserFieldsFragment> }

export type GetSettingsQueryVariables = Exact<{ [key: string]: never }>

export type GetSettingsQuery = {
  settings: Pick<Settings, 'id' | 'language' | 'plexAccountToken' | 'port'>
  plexInstances: Array<PlexFieldsFragment>
  radarrInstances: Array<RadarrFieldsFragment>
}

export type GetUsersQueryVariables = Exact<{ [key: string]: never }>

export type GetUsersQuery = {
  account: {
    servers: Array<
      Pick<PlexDeviceServer, 'id' | 'clientIdentifier' | 'name'> & {
        libraries: Array<Pick<PlexSharedLibrary, 'id' | 'title' | 'type'>>
      }
    >
    users: Array<UserFieldsFragment>
  }
}

export const UserFieldsFragmentDoc: DocumentNode<UserFieldsFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PlexUser' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sharedServers' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'machineIdentifier' } },
                { kind: 'Field', name: { kind: 'Name', value: 'allLibraries' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'libraries' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
}
export const PlexFieldsFragmentDoc: DocumentNode<PlexFieldsFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'plexFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PlexInstance' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'friendlyName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'machineIdentifier' } },
          { kind: 'Field', name: { kind: 'Name', value: 'token' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
        ],
      },
    },
  ],
}
export const RadarrFieldsFragmentDoc: DocumentNode<RadarrFieldsFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'radarrFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'RadarrInstance' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'instanceName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'url' } },
          { kind: 'Field', name: { kind: 'Name', value: 'apiKey' } },
        ],
      },
    },
  ],
}
export const RemovePlexInstanceDocument: DocumentNode<
  RemovePlexInstanceMutation,
  RemovePlexInstanceMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'removePlexInstance' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'RemovePlexInstanceInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removePlexInstance' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'plexFields' } }],
            },
          },
        ],
      },
    },
    ...PlexFieldsFragmentDoc.definitions,
  ],
}
export const UpsertPlexInstanceDocument: DocumentNode<
  UpsertPlexInstanceMutation,
  UpsertPlexInstanceMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'upsertPlexInstance' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpsertPlexInstanceInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'upsertPlexInstance' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'plexFields' } }],
            },
          },
        ],
      },
    },
    ...PlexFieldsFragmentDoc.definitions,
  ],
}
export const UpsertRadarrInstanceDocument: DocumentNode<
  UpsertRadarrInstanceMutation,
  UpsertRadarrInstanceMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'upsertRadarrInstance' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpsertRadarrInstanceInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'upsertRadarrInstance' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'radarrFields' } },
              ],
            },
          },
        ],
      },
    },
    ...RadarrFieldsFragmentDoc.definitions,
  ],
}
export const RemoveRadarrInstanceDocument: DocumentNode<
  RemoveRadarrInstanceMutation,
  RemoveRadarrInstanceMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'removeRadarrInstance' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'RemoveRadarrInstanceInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeRadarrInstance' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'radarrFields' } },
              ],
            },
          },
        ],
      },
    },
    ...RadarrFieldsFragmentDoc.definitions,
  ],
}
export const UpdateSettingsDocument: DocumentNode<
  UpdateSettingsMutation,
  UpdateSettingsMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateSettings' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateSettingsInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateSettings' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'language' } },
                { kind: 'Field', name: { kind: 'Name', value: 'port' } },
                { kind: 'Field', name: { kind: 'Name', value: 'plexAccountToken' } },
              ],
            },
          },
        ],
      },
    },
  ],
}
export const UpdateUsersDocument: DocumentNode<
  UpdateUsersMutation,
  UpdateUsersMutationVariables
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateUsers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: { kind: 'Name', value: 'UpdateUserSharingInput' },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateUsers' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } }],
            },
          },
        ],
      },
    },
    ...UserFieldsFragmentDoc.definitions,
  ],
}
export const GetSettingsDocument: DocumentNode<GetSettingsQuery, GetSettingsQueryVariables> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getSettings' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'settings' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'language' } },
                { kind: 'Field', name: { kind: 'Name', value: 'plexAccountToken' } },
                { kind: 'Field', name: { kind: 'Name', value: 'port' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'plexInstances' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'plexFields' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'radarrInstances' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'radarrFields' } },
              ],
            },
          },
        ],
      },
    },
    ...PlexFieldsFragmentDoc.definitions,
    ...RadarrFieldsFragmentDoc.definitions,
  ],
}
export const GetUsersDocument: DocumentNode<GetUsersQuery, GetUsersQueryVariables> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getUsers' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'account' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'servers' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'clientIdentifier' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'libraries' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'users' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...UserFieldsFragmentDoc.definitions,
  ],
}
