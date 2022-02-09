import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type AbsPlexDevice = {
  clientIdentifier: Scalars['String'];
  connection: Array<PlexDeviceConnection>;
  createdAt: Scalars['DateTime'];
  device: Scalars['String'];
  id: Scalars['String'];
  lastSeenAt: Scalars['DateTime'];
  model: Scalars['String'];
  name: Scalars['String'];
  platform: Scalars['String'];
  platformVersion: Scalars['String'];
  product: Scalars['String'];
  productVersion: Scalars['String'];
  provides: Scalars['String'];
  publicAddress: Scalars['String'];
  token: Scalars['String'];
  vendor: Scalars['String'];
  version: Scalars['String'];
};

export type AddPlexInstanceInput = {
  /** Token for the Plex Server */
  token: Scalars['String'];
  /** URL of the Plex Server */
  url: Scalars['String'];
};

export type AddRadarrInstanceInput = {
  apiKey: Scalars['String'];
  instanceName: Scalars['String'];
  url: Scalars['String'];
};

export enum BlendMode {
  Add = 'ADD',
  Darken = 'DARKEN',
  DestinationOver = 'DESTINATION_OVER',
  Difference = 'DIFFERENCE',
  Exclusion = 'EXCLUSION',
  Hardlight = 'HARDLIGHT',
  Lighten = 'LIGHTEN',
  Multiply = 'MULTIPLY',
  Overlay = 'OVERLAY',
  Screen = 'SCREEN',
  SourceOver = 'SOURCE_OVER'
}


export enum LibraryType {
  Artist = 'ARTIST',
  Movie = 'MOVIE',
  Photo = 'PHOTO',
  Show = 'SHOW'
}

export type Media = Node & {
  __typename?: 'Media';
  id: Scalars['ID'];
  imdbId: Scalars['String'];
  omdbMetadata: OmDbMetadata;
  plexMetadata: Array<PlexMetadata>;
  radarrMetadata: RadarrMetadata;
  title: Scalars['String'];
  tmdbMetadata: Scalars['String'];
  type: Scalars['String'];
  year: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addPlexInstance: PlexInstance;
  addRadarrInstance: RadarrInstance;
  previewPoster: Scalars['String'];
  removePlexInstance?: Maybe<PlexInstance>;
  removeRadarrInstance?: Maybe<RadarrInstance>;
  updatePlexInstance?: Maybe<PlexInstance>;
  updateRadarrInstance?: Maybe<RadarrInstance>;
  updateSettings: Settings;
  updateUsers: Array<PlexUserObject>;
  upsertPlexInstance: PlexInstance;
  upsertRadarrInstance: RadarrInstance;
};


export type MutationAddPlexInstanceArgs = {
  input: AddPlexInstanceInput;
};


export type MutationAddRadarrInstanceArgs = {
  input: AddRadarrInstanceInput;
};


export type MutationPreviewPosterArgs = {
  input: PosterGenerationInput;
};


export type MutationRemovePlexInstanceArgs = {
  input: RemovePlexInstanceInput;
};


export type MutationRemoveRadarrInstanceArgs = {
  input: RemoveRadarrInstanceInput;
};


export type MutationUpdatePlexInstanceArgs = {
  input: UpdatePlexInstanceInput;
};


export type MutationUpdateRadarrInstanceArgs = {
  input: UpdateRadarrInstanceInput;
};


export type MutationUpdateSettingsArgs = {
  input: UpdateSettingsInput;
};


export type MutationUpdateUsersArgs = {
  input: Array<UpdateUserSharingInput>;
};


export type MutationUpsertPlexInstanceArgs = {
  input: UpsertPlexInstanceInput;
};


export type MutationUpsertRadarrInstanceArgs = {
  input: UpsertRadarrInstanceInput;
};

export type Node = {
  id: Scalars['ID'];
};

export type OmDbMetadata = {
  __typename?: 'OMDbMetadata';
  actors: Scalars['String'];
  awards: Scalars['String'];
  boxOffice: Scalars['String'];
  country: Scalars['String'];
  director: Scalars['String'];
  dvd: Scalars['String'];
  imdbRating: Scalars['Float'];
  imdbVotes: Scalars['Float'];
  language: Scalars['String'];
  metascore: Scalars['Float'];
  plot: Scalars['String'];
  poster: Scalars['String'];
  production: Scalars['String'];
  rated: Scalars['String'];
  released: Scalars['String'];
  rottenTomatoesRating?: Maybe<Scalars['Float']>;
  runtime: Scalars['String'];
  type: Scalars['String'];
  website: Scalars['String'];
  writer: Scalars['String'];
  year: Scalars['Float'];
};

/** Plex Account Model */
export type PlexAccountObject = {
  __typename?: 'PlexAccountObject';
  devices: Array<PlexDevice>;
  email: Scalars['String'];
  id: Scalars['ID'];
  servers: Array<PlexDeviceServer>;
  token: Scalars['String'];
  username: Scalars['String'];
  users: Array<PlexUserObject>;
  uuid: Scalars['String'];
};

export type PlexDevice = AbsPlexDevice & {
  __typename?: 'PlexDevice';
  clientIdentifier: Scalars['String'];
  connection: Array<PlexDeviceConnection>;
  createdAt: Scalars['DateTime'];
  device: Scalars['String'];
  id: Scalars['String'];
  lastSeenAt: Scalars['DateTime'];
  model: Scalars['String'];
  name: Scalars['String'];
  platform: Scalars['String'];
  platformVersion: Scalars['String'];
  product: Scalars['String'];
  productVersion: Scalars['String'];
  provides: Scalars['String'];
  publicAddress: Scalars['String'];
  token: Scalars['String'];
  vendor: Scalars['String'];
  version: Scalars['String'];
};

export type PlexDeviceConnection = {
  __typename?: 'PlexDeviceConnection';
  uri: Scalars['String'];
};

export type PlexDeviceServer = AbsPlexDevice & {
  __typename?: 'PlexDeviceServer';
  clientIdentifier: Scalars['String'];
  connection: Array<PlexDeviceConnection>;
  createdAt: Scalars['DateTime'];
  device: Scalars['String'];
  id: Scalars['String'];
  lastSeenAt: Scalars['DateTime'];
  libraries: Array<PlexSharedLibraryObject>;
  model: Scalars['String'];
  name: Scalars['String'];
  platform: Scalars['String'];
  platformVersion: Scalars['String'];
  product: Scalars['String'];
  productVersion: Scalars['String'];
  provides: Scalars['String'];
  publicAddress: Scalars['String'];
  token: Scalars['String'];
  vendor: Scalars['String'];
  version: Scalars['String'];
};

export type PlexInstance = Node & {
  __typename?: 'PlexInstance';
  /** Server name set by the owner */
  friendlyName: Scalars['String'];
  id: Scalars['ID'];
  machineIdentifier: Scalars['String'];
  token: Scalars['String'];
  url: Scalars['String'];
};

export type PlexMetadata = {
  __typename?: 'PlexMetadata';
  addedAt: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  librarySectionID: Scalars['Float'];
  librarySectionKey: Scalars['String'];
  librarySectionTitle: Scalars['String'];
  librarySectionUUID: Scalars['String'];
  originallyAvailableAt: Scalars['String'];
  ratingKey: Scalars['String'];
  thumb: Scalars['String'];
  title: Scalars['String'];
  type: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type PlexSharedLibraryObject = {
  __typename?: 'PlexSharedLibraryObject';
  id: Scalars['ID'];
  key: Scalars['Float'];
  title: Scalars['String'];
  type: LibraryType;
};

export type PlexSharedServerObject = {
  __typename?: 'PlexSharedServerObject';
  accepted: Scalars['Boolean'];
  acceptedAt: Scalars['DateTime'];
  allLibraries: Scalars['Boolean'];
  deletedAt: Scalars['DateTime'];
  id: Scalars['ID'];
  inviteToken: Scalars['String'];
  invitedEmail: Scalars['String'];
  invitedId: Scalars['Float'];
  lastSeenAt: Scalars['DateTime'];
  leftAt: Scalars['DateTime'];
  libraries: Array<PlexSharedLibraryObject>;
  machineIdentifier: Scalars['String'];
  name: Scalars['String'];
  numLibraries: Scalars['Float'];
  owned: Scalars['Boolean'];
  ownerId: Scalars['Float'];
  pending: Scalars['Boolean'];
  serverId: Scalars['Float'];
};

export type PlexUserObject = {
  __typename?: 'PlexUserObject';
  allowCameraUpload: Scalars['Boolean'];
  allowChannels: Scalars['Boolean'];
  allowSubtitleAdmin: Scalars['Boolean'];
  allowSync: Scalars['Boolean'];
  allowTuners: Scalars['Boolean'];
  email: Scalars['String'];
  filterAll: Scalars['Boolean'];
  filterMovies: Scalars['Boolean'];
  filterMusic: Scalars['Boolean'];
  filterPhotos: Scalars['Boolean'];
  filterTelevision: Scalars['Boolean'];
  home: Scalars['Boolean'];
  id: Scalars['ID'];
  protected: Scalars['Boolean'];
  recommendationsPlaylistId: Scalars['String'];
  sharedServers: Array<PlexSharedServerObject>;
  thumb: Scalars['String'];
  title: Scalars['String'];
  username: Scalars['String'];
};

export type PosterGenerationInput = {
  BLEND_MODE?: Maybe<BlendMode>;
  BOX_COLOUR?: Maybe<Scalars['String']>;
  DESTINATION_OPACITY?: Maybe<Scalars['Float']>;
  FONT_COLOUR?: Maybe<Scalars['String']>;
  GLOBAL_ICON_SCALE?: Maybe<Scalars['Float']>;
  IMAGE_HEIGHT?: Maybe<Scalars['Float']>;
  IMAGE_WIDTH?: Maybe<Scalars['Float']>;
  JPEG_QUALITY?: Maybe<Scalars['Float']>;
  RATING_BOX_HEIGHT?: Maybe<Scalars['Float']>;
  RATING_SCALE?: Maybe<Scalars['Float']>;
  SOURCE_OPACITY?: Maybe<Scalars['Float']>;
  SPACING?: Maybe<Scalars['Float']>;
};

export type PosterGenerationSettings = {
  __typename?: 'PosterGenerationSettings';
  BLEND_MODE: BlendMode;
  BOX_COLOUR: Scalars['String'];
  DESTINATION_OPACITY: Scalars['Float'];
  FONT_COLOUR: Scalars['String'];
  GLOBAL_ICON_SCALE: Scalars['Float'];
  IMAGE_HEIGHT: Scalars['Float'];
  IMAGE_WIDTH: Scalars['Float'];
  JPEG_QUALITY: Scalars['Float'];
  RATING_SCALE: Scalars['Float'];
  SOURCE_OPACITY: Scalars['Float'];
  SPACING: Scalars['Float'];
};

export type PosterGenerationSettingsInput = {
  BLEND_MODE: BlendMode;
  BOX_COLOUR: Scalars['String'];
  DESTINATION_OPACITY: Scalars['Float'];
  FONT_COLOUR: Scalars['String'];
  GLOBAL_ICON_SCALE: Scalars['Float'];
  IMAGE_HEIGHT: Scalars['Float'];
  IMAGE_WIDTH: Scalars['Float'];
  JPEG_QUALITY: Scalars['Float'];
  RATING_SCALE: Scalars['Float'];
  SOURCE_OPACITY: Scalars['Float'];
  SPACING: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  account: PlexAccountObject;
  media: Array<Media>;
  node?: Maybe<Node>;
  nodes?: Maybe<Array<Node>>;
  plexInstance: PlexInstance;
  plexInstances: Array<PlexInstance>;
  radarrInstance: RadarrInstance;
  radarrInstances: Array<RadarrInstance>;
  settings: Settings;
  system: System;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryPlexInstanceArgs = {
  input: WhereInput;
};


export type QueryRadarrInstanceArgs = {
  input: WhereInput;
};

export type RadarrInstance = Node & {
  __typename?: 'RadarrInstance';
  apiKey: Scalars['String'];
  id: Scalars['ID'];
  instanceName: Scalars['String'];
  url: Scalars['String'];
};

export type RadarrMetadata = {
  __typename?: 'RadarrMetadata';
  added: Scalars['String'];
  alternateTitles: Array<Scalars['String']>;
  certification: Scalars['String'];
  cleanTitle: Scalars['String'];
  dateAdded: Scalars['String'];
  digitalRelease: Scalars['String'];
  edition: Scalars['String'];
  folderName: Scalars['String'];
  hasFile: Scalars['Boolean'];
  id: Scalars['Float'];
  imdbId: Scalars['String'];
  inCinemas: Scalars['String'];
  indexerFlags: Scalars['Float'];
  isAvailable: Scalars['Boolean'];
  minimumAvailability: Scalars['String'];
  monitored: Scalars['Boolean'];
  originalTitle: Scalars['String'];
  overview: Scalars['String'];
  path: Scalars['String'];
  physicalRelease: Scalars['String'];
  quality: Scalars['String'];
  qualityCutoffNotMet: Scalars['Boolean'];
  qualityProfileId: Scalars['Float'];
  relativePath: Scalars['String'];
  releaseGroup?: Maybe<Scalars['String']>;
  runtime: Scalars['Float'];
  secondaryYearSourceId: Scalars['Float'];
  size: Scalars['Float'];
  sizeOnDisk: Scalars['Float'];
  sortTitle: Scalars['String'];
  status: Scalars['String'];
  studio: Scalars['String'];
  tags?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  titleSlug: Scalars['String'];
  tmdbId: Scalars['Float'];
  website: Scalars['String'];
  year: Scalars['Float'];
  youTubeTrailerId: Scalars['String'];
};

export type RemovePlexInstanceInput = {
  id: Scalars['ID'];
};

export type RemoveRadarrInstanceInput = {
  id: Scalars['ID'];
};

export type RunTaskInput = {
  taskName: TaskName;
};

export type Settings = Node & {
  __typename?: 'Settings';
  apiKey: Scalars['String'];
  id: Scalars['ID'];
  language: Scalars['String'];
  omdbKey?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  plexAccountToken?: Maybe<Scalars['String']>;
  port: Scalars['Float'];
  posterSettings: PosterGenerationSettings;
  tmdbKey?: Maybe<Scalars['String']>;
};

export type System = {
  __typename?: 'System';
  tasks: Array<Task>;
  version: Scalars['String'];
};

export type TmdbMetadata = {
  __typename?: 'TMDBMetadata';
  adult: Scalars['Boolean'];
  backdrop_path: Scalars['String'];
  budget: Scalars['Float'];
  genres: Array<Scalars['String']>;
  homepage: Scalars['String'];
  id: Scalars['Float'];
  imdb_id: Scalars['String'];
  original_language: Scalars['String'];
  original_title: Scalars['String'];
  overview: Scalars['String'];
  popularity: Scalars['Float'];
  poster_path: Scalars['String'];
  production_companies_names: Array<Scalars['String']>;
  production_countries_iso: Array<Scalars['String']>;
  release_date: Scalars['String'];
  revenue: Scalars['Float'];
  runtime: Scalars['Float'];
  spoken_languages_iso: Array<Scalars['String']>;
  status: Scalars['String'];
  tagline: Scalars['String'];
  title: Scalars['String'];
  video: Scalars['Boolean'];
  vote_average: Scalars['Float'];
  vote_count: Scalars['Float'];
};

export type Task = {
  __typename?: 'Task';
  completed?: Maybe<Scalars['Float']>;
  name: TaskName;
  started?: Maybe<Scalars['Float']>;
  status: TaskStatus;
};

export enum TaskName {
  Importer = 'importer',
  RestorePoster = 'restore_poster',
  ThumbnailGenerate = 'thumbnail_generate'
}

export enum TaskStatus {
  Errored = 'errored',
  Finished = 'finished',
  NotStarted = 'not_started',
  Running = 'running'
}

export type UpdatePlexInstanceInput = {
  id: Scalars['ID'];
  port: Scalars['Float'];
  token: Scalars['String'];
  url: Scalars['String'];
};

export type UpdateRadarrInstanceInput = {
  apiKey: Scalars['String'];
  id: Scalars['ID'];
  instanceName: Scalars['String'];
  url: Scalars['String'];
};

export type UpdateSettingsInput = {
  language?: Maybe<Scalars['String']>;
  plexAccountToken?: Maybe<Scalars['String']>;
  port?: Maybe<Scalars['Float']>;
  posterSettings?: Maybe<PosterGenerationSettingsInput>;
};

export type UpdateUserSharedServerInput = {
  allLibraries: Scalars['Boolean'];
  librarySectionIds: Array<Scalars['ID']>;
  machineIdentifier: Scalars['String'];
};

export type UpdateUserSharingInput = {
  /** Plex User ID */
  id: Scalars['ID'];
  servers: Array<UpdateUserSharedServerInput>;
};

export type UpsertPlexInstanceInput = {
  id?: Maybe<Scalars['ID']>;
  /** Token for the Plex Server */
  token: Scalars['String'];
  /** URL of the Plex Server */
  url: Scalars['String'];
};

export type UpsertRadarrInstanceInput = {
  apiKey: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  instanceName: Scalars['String'];
  url: Scalars['String'];
};

export type WhereInput = {
  id: Scalars['String'];
};

export type RemovePlexInstanceMutationVariables = Exact<{
  input: RemovePlexInstanceInput;
}>;


export type RemovePlexInstanceMutation = (
  { __typename?: 'Mutation' }
  & { removePlexInstance?: Maybe<(
    { __typename?: 'PlexInstance' }
    & Pick<PlexInstance, 'id' | 'friendlyName' | 'machineIdentifier' | 'token' | 'url'>
  )> }
);

export type UpsertPlexInstanceMutationVariables = Exact<{
  input: UpsertPlexInstanceInput;
}>;


export type UpsertPlexInstanceMutation = (
  { __typename?: 'Mutation' }
  & { upsertPlexInstance: (
    { __typename?: 'PlexInstance' }
    & Pick<PlexInstance, 'id' | 'friendlyName' | 'machineIdentifier' | 'token' | 'url'>
  ) }
);

export type UpsertRadarrInstanceMutationVariables = Exact<{
  input: UpsertRadarrInstanceInput;
}>;


export type UpsertRadarrInstanceMutation = (
  { __typename?: 'Mutation' }
  & { upsertRadarrInstance: (
    { __typename?: 'RadarrInstance' }
    & Pick<RadarrInstance, 'id' | 'instanceName' | 'url' | 'apiKey'>
  ) }
);

export type RemoveRadarrInstanceMutationVariables = Exact<{
  input: RemoveRadarrInstanceInput;
}>;


export type RemoveRadarrInstanceMutation = (
  { __typename?: 'Mutation' }
  & { removeRadarrInstance?: Maybe<(
    { __typename?: 'RadarrInstance' }
    & Pick<RadarrInstance, 'id' | 'instanceName' | 'url' | 'apiKey'>
  )> }
);

export type UpdateSettingsMutationVariables = Exact<{
  input: UpdateSettingsInput;
}>;


export type UpdateSettingsMutation = (
  { __typename?: 'Mutation' }
  & { updateSettings: (
    { __typename?: 'Settings' }
    & Pick<Settings, 'id' | 'language' | 'port' | 'plexAccountToken'>
  ) }
);

export type UpdateUsersMutationVariables = Exact<{
  input: Array<UpdateUserSharingInput> | UpdateUserSharingInput;
}>;


export type UpdateUsersMutation = (
  { __typename?: 'Mutation' }
  & { updateUsers: Array<(
    { __typename?: 'PlexUserObject' }
    & Pick<PlexUserObject, 'id' | 'title'>
    & { sharedServers: Array<(
      { __typename?: 'PlexSharedServerObject' }
      & Pick<PlexSharedServerObject, 'id' | 'machineIdentifier' | 'allLibraries'>
      & { libraries: Array<(
        { __typename?: 'PlexSharedLibraryObject' }
        & Pick<PlexSharedLibraryObject, 'id'>
      )> }
    )> }
  )> }
);

export type GetMediaQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMediaQuery = (
  { __typename?: 'Query' }
  & { media: Array<(
    { __typename?: 'Media' }
    & Pick<Media, 'id' | 'title' | 'year' | 'type'>
  )> }
);

export type GetSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsQuery = (
  { __typename?: 'Query' }
  & { settings: (
    { __typename?: 'Settings' }
    & Pick<Settings, 'id' | 'language' | 'plexAccountToken' | 'port' | 'omdbKey'>
    & { posterSettings: (
      { __typename?: 'PosterGenerationSettings' }
      & Pick<PosterGenerationSettings, 'BLEND_MODE' | 'DESTINATION_OPACITY' | 'FONT_COLOUR' | 'GLOBAL_ICON_SCALE' | 'JPEG_QUALITY' | 'RATING_SCALE' | 'SOURCE_OPACITY' | 'SPACING' | 'BOX_COLOUR'>
    ) }
  ), plexInstances: Array<(
    { __typename?: 'PlexInstance' }
    & Pick<PlexInstance, 'id' | 'friendlyName' | 'machineIdentifier' | 'token' | 'url'>
  )>, radarrInstances: Array<(
    { __typename?: 'RadarrInstance' }
    & Pick<RadarrInstance, 'id' | 'instanceName' | 'url' | 'apiKey'>
  )> }
);

export type GetSystemQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSystemQuery = (
  { __typename?: 'Query' }
  & { system: (
    { __typename?: 'System' }
    & Pick<System, 'version'>
    & { tasks: Array<(
      { __typename?: 'Task' }
      & Pick<Task, 'name' | 'started' | 'completed' | 'status'>
    )> }
  ) }
);

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = (
  { __typename?: 'Query' }
  & { account: (
    { __typename?: 'PlexAccountObject' }
    & { servers: Array<(
      { __typename?: 'PlexDeviceServer' }
      & Pick<PlexDeviceServer, 'id' | 'clientIdentifier' | 'name'>
      & { libraries: Array<(
        { __typename?: 'PlexSharedLibraryObject' }
        & Pick<PlexSharedLibraryObject, 'id' | 'title' | 'type'>
      )> }
    )>, users: Array<(
      { __typename?: 'PlexUserObject' }
      & Pick<PlexUserObject, 'id' | 'title'>
      & { sharedServers: Array<(
        { __typename?: 'PlexSharedServerObject' }
        & Pick<PlexSharedServerObject, 'id' | 'machineIdentifier' | 'allLibraries'>
        & { libraries: Array<(
          { __typename?: 'PlexSharedLibraryObject' }
          & Pick<PlexSharedLibraryObject, 'id'>
        )> }
      )> }
    )> }
  ) }
);


export const RemovePlexInstanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removePlexInstance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemovePlexInstanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePlexInstance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"friendlyName"}},{"kind":"Field","name":{"kind":"Name","value":"machineIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<RemovePlexInstanceMutation, RemovePlexInstanceMutationVariables>;
export const UpsertPlexInstanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"upsertPlexInstance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertPlexInstanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertPlexInstance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"friendlyName"}},{"kind":"Field","name":{"kind":"Name","value":"machineIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<UpsertPlexInstanceMutation, UpsertPlexInstanceMutationVariables>;
export const UpsertRadarrInstanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"upsertRadarrInstance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertRadarrInstanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertRadarrInstance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"instanceName"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"apiKey"}}]}}]}}]} as unknown as DocumentNode<UpsertRadarrInstanceMutation, UpsertRadarrInstanceMutationVariables>;
export const RemoveRadarrInstanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeRadarrInstance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveRadarrInstanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeRadarrInstance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"instanceName"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"apiKey"}}]}}]}}]} as unknown as DocumentNode<RemoveRadarrInstanceMutation, RemoveRadarrInstanceMutationVariables>;
export const UpdateSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"plexAccountToken"}}]}}]}}]} as unknown as DocumentNode<UpdateSettingsMutation, UpdateSettingsMutationVariables>;
export const UpdateUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserSharingInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"sharedServers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"machineIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"allLibraries"}},{"kind":"Field","name":{"kind":"Name","value":"libraries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUsersMutation, UpdateUsersMutationVariables>;
export const GetMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMedia"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<GetMediaQuery, GetMediaQueryVariables>;
export const GetSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"plexAccountToken"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"omdbKey"}},{"kind":"Field","name":{"kind":"Name","value":"posterSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"BLEND_MODE"}},{"kind":"Field","name":{"kind":"Name","value":"DESTINATION_OPACITY"}},{"kind":"Field","name":{"kind":"Name","value":"FONT_COLOUR"}},{"kind":"Field","name":{"kind":"Name","value":"GLOBAL_ICON_SCALE"}},{"kind":"Field","name":{"kind":"Name","value":"JPEG_QUALITY"}},{"kind":"Field","name":{"kind":"Name","value":"RATING_SCALE"}},{"kind":"Field","name":{"kind":"Name","value":"SOURCE_OPACITY"}},{"kind":"Field","name":{"kind":"Name","value":"SPACING"}},{"kind":"Field","name":{"kind":"Name","value":"BOX_COLOUR"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"plexInstances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"friendlyName"}},{"kind":"Field","name":{"kind":"Name","value":"machineIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"radarrInstances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"instanceName"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"apiKey"}}]}}]}}]} as unknown as DocumentNode<GetSettingsQuery, GetSettingsQueryVariables>;
export const GetSystemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"system"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"started"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetSystemQuery, GetSystemQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"servers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"clientIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"libraries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"sharedServers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"machineIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"allLibraries"}},{"kind":"Field","name":{"kind":"Name","value":"libraries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;