import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
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

export type System = {
  __typename?: 'System';
  version: Scalars['String'];
  tasks: Array<Task>;
};

export type Task = {
  __typename?: 'Task';
  name: TaskName;
  started?: Maybe<Scalars['Float']>;
  completed?: Maybe<Scalars['Float']>;
  status: TaskStatus;
};

export enum TaskName {
  Importer = 'importer',
  ThumbnailGenerate = 'thumbnail_generate',
  RestorePoster = 'restore_poster'
}

export enum TaskStatus {
  Running = 'running',
  Finished = 'finished',
  NotStarted = 'not_started',
  Errored = 'errored'
}

/** Plex Account Model */
export type PlexAccount = {
  __typename?: 'PlexAccount';
  id: Scalars['ID'];
  username: Scalars['String'];
  uuid: Scalars['String'];
  email: Scalars['String'];
  token: Scalars['String'];
  users: Array<PlexUser>;
  devices: Array<PlexDevice>;
  servers: Array<PlexDeviceServer>;
};

export type PlexUser = {
  __typename?: 'PlexUser';
  id: Scalars['ID'];
  title: Scalars['String'];
  username: Scalars['String'];
  recommendationsPlaylistId: Scalars['String'];
  thumb: Scalars['String'];
  protected: Scalars['Boolean'];
  home: Scalars['Boolean'];
  allowTuners: Scalars['Boolean'];
  allowSync: Scalars['Boolean'];
  allowChannels: Scalars['Boolean'];
  allowCameraUpload: Scalars['Boolean'];
  allowSubtitleAdmin: Scalars['Boolean'];
  filterAll: Scalars['Boolean'];
  filterMovies: Scalars['Boolean'];
  filterMusic: Scalars['Boolean'];
  filterPhotos: Scalars['Boolean'];
  filterTelevision: Scalars['Boolean'];
  email: Scalars['String'];
  sharedServers: Array<PlexSharedServer>;
};

export type PlexSharedServer = {
  __typename?: 'PlexSharedServer';
  id: Scalars['ID'];
  name: Scalars['String'];
  ownerId: Scalars['Float'];
  invitedId: Scalars['Float'];
  invitedEmail: Scalars['String'];
  serverId: Scalars['Float'];
  accepted: Scalars['Boolean'];
  acceptedAt: Scalars['DateTime'];
  deletedAt: Scalars['DateTime'];
  leftAt: Scalars['DateTime'];
  owned: Scalars['Boolean'];
  inviteToken: Scalars['String'];
  machineIdentifier: Scalars['String'];
  lastSeenAt: Scalars['DateTime'];
  numLibraries: Scalars['Float'];
  allLibraries: Scalars['Boolean'];
  libraries: Array<PlexSharedLibrary>;
};


export type PlexSharedLibrary = {
  __typename?: 'PlexSharedLibrary';
  id: Scalars['ID'];
  key: Scalars['Float'];
  title: Scalars['String'];
  type: LibraryType;
};

/** Type of library (movie, show, photo, music) */
export enum LibraryType {
  Movie = 'MOVIE',
  Photo = 'PHOTO',
  Show = 'SHOW',
  Artist = 'ARTIST'
}

export type PlexDeviceConnection = {
  __typename?: 'PlexDeviceConnection';
  uri: Scalars['String'];
};

export type PlexDevice = AbsPlexDevice & {
  __typename?: 'PlexDevice';
  name: Scalars['String'];
  publicAddress: Scalars['String'];
  product: Scalars['String'];
  productVersion: Scalars['String'];
  platform: Scalars['String'];
  platformVersion: Scalars['String'];
  device: Scalars['String'];
  model: Scalars['String'];
  vendor: Scalars['String'];
  provides: Scalars['String'];
  clientIdentifier: Scalars['String'];
  version: Scalars['String'];
  id: Scalars['String'];
  token: Scalars['String'];
  createdAt: Scalars['DateTime'];
  lastSeenAt: Scalars['DateTime'];
  connection: Array<PlexDeviceConnection>;
};

export type PlexDeviceServer = AbsPlexDevice & {
  __typename?: 'PlexDeviceServer';
  name: Scalars['String'];
  publicAddress: Scalars['String'];
  product: Scalars['String'];
  productVersion: Scalars['String'];
  platform: Scalars['String'];
  platformVersion: Scalars['String'];
  device: Scalars['String'];
  model: Scalars['String'];
  vendor: Scalars['String'];
  provides: Scalars['String'];
  clientIdentifier: Scalars['String'];
  version: Scalars['String'];
  id: Scalars['String'];
  token: Scalars['String'];
  createdAt: Scalars['DateTime'];
  lastSeenAt: Scalars['DateTime'];
  connection: Array<PlexDeviceConnection>;
  libraries: Array<PlexSharedLibrary>;
};

export type PosterGenerationSettings = {
  __typename?: 'PosterGenerationSettings';
  SOURCE_OPACITY: Scalars['Float'];
  DESTINATION_OPACITY: Scalars['Float'];
  BLEND_MODE: BlendMode;
  SPACING: Scalars['Float'];
  GLOBAL_ICON_SCALE: Scalars['Float'];
  RATING_SCALE: Scalars['Float'];
  FONT_COLOUR: Scalars['String'];
  IMAGE_HEIGHT: Scalars['Float'];
  IMAGE_WIDTH: Scalars['Float'];
  JPEG_QUALITY: Scalars['Float'];
  BOX_COLOUR: Scalars['String'];
};

export enum BlendMode {
  SourceOver = 'SOURCE_OVER',
  DestinationOver = 'DESTINATION_OVER',
  Multiply = 'MULTIPLY',
  Add = 'ADD',
  Screen = 'SCREEN',
  Overlay = 'OVERLAY',
  Darken = 'DARKEN',
  Lighten = 'LIGHTEN',
  Hardlight = 'HARDLIGHT',
  Difference = 'DIFFERENCE',
  Exclusion = 'EXCLUSION'
}

export type Node = {
  id: Scalars['ID'];
};

export type RadarrQualityProfile = {
  __typename?: 'RadarrQualityProfile';
  id: Scalars['Float'];
  name: Scalars['String'];
  upgradeAllowed: Scalars['Boolean'];
  language: Array<RadarrLanguage>;
};

export type RadarrLanguage = {
  __typename?: 'RadarrLanguage';
  id: Scalars['Float'];
  name: Scalars['String'];
};

export type AbsPlexDevice = {
  name: Scalars['String'];
  publicAddress: Scalars['String'];
  product: Scalars['String'];
  productVersion: Scalars['String'];
  platform: Scalars['String'];
  platformVersion: Scalars['String'];
  device: Scalars['String'];
  model: Scalars['String'];
  vendor: Scalars['String'];
  provides: Scalars['String'];
  clientIdentifier: Scalars['String'];
  version: Scalars['String'];
  id: Scalars['String'];
  token: Scalars['String'];
  createdAt: Scalars['DateTime'];
  lastSeenAt: Scalars['DateTime'];
  connection: Array<PlexDeviceConnection>;
};

export type RunTaskInput = {
  taskName: TaskName;
};

export type PosterGenerationInput = {
  SOURCE_OPACITY?: Maybe<Scalars['Float']>;
  DESTINATION_OPACITY?: Maybe<Scalars['Float']>;
  BLEND_MODE?: Maybe<BlendMode>;
  SPACING?: Maybe<Scalars['Float']>;
  GLOBAL_ICON_SCALE?: Maybe<Scalars['Float']>;
  RATING_SCALE?: Maybe<Scalars['Float']>;
  FONT_COLOUR?: Maybe<Scalars['String']>;
  IMAGE_HEIGHT?: Maybe<Scalars['Float']>;
  IMAGE_WIDTH?: Maybe<Scalars['Float']>;
  RATING_BOX_HEIGHT?: Maybe<Scalars['Float']>;
  JPEG_QUALITY?: Maybe<Scalars['Float']>;
  BOX_COLOUR?: Maybe<Scalars['String']>;
};

export type WhereInput = {
  id: Scalars['String'];
};

export type BaseInput = {
  id: Scalars['ID'];
};

export type AddPlexInstanceInput = {
  /** URL of the Plex Server */
  url: Scalars['String'];
  /** Token for the Plex Server */
  token: Scalars['String'];
};

export type UpdatePlexInstanceInput = {
  id: Scalars['ID'];
  url: Scalars['String'];
  token: Scalars['String'];
};

export type UpdateSettingsInput = {
  id: Scalars['ID'];
  port?: Maybe<Scalars['Float']>;
  plexAccountToken?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
};

export type AddRadarrInstanceInput = {
  url: Scalars['String'];
  apiKey: Scalars['String'];
  instanceName: Scalars['String'];
};

export type UpdateRadarrInstanceInput = {
  id: Scalars['ID'];
  url: Scalars['String'];
  apiKey: Scalars['String'];
  instanceName: Scalars['String'];
};

export type UpdateUserSharingInput = {
  /** Plex User ID */
  id: Scalars['ID'];
  servers: Array<UpdateUserSharedServerInput>;
};

export type UpdateUserSharedServerInput = {
  machineIdentifier: Scalars['String'];
  allLibraries: Scalars['Boolean'];
  librarySectionIds: Array<Scalars['ID']>;
};

export type Settings = Node & {
  __typename?: 'Settings';
  id: Scalars['ID'];
  language: Scalars['String'];
  plexAccountToken?: Maybe<Scalars['String']>;
  omdbKey?: Maybe<Scalars['String']>;
  tmdbKey?: Maybe<Scalars['String']>;
  posterSettings: PosterGenerationSettings;
  port: Scalars['Float'];
};

export type PlexInstance = Node & {
  __typename?: 'PlexInstance';
  id: Scalars['ID'];
  machineIdentifier: Scalars['String'];
  /** Server name set by the owner */
  friendlyName: Scalars['String'];
  url: Scalars['String'];
  token: Scalars['String'];
};

export type RadarrInstance = Node & {
  __typename?: 'RadarrInstance';
  id: Scalars['ID'];
  url: Scalars['String'];
  apiKey: Scalars['String'];
  instanceName: Scalars['String'];
};

export type User = Node & {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  settings: Settings;
};

export type Media = Node & {
  __typename?: 'Media';
  id: Scalars['ID'];
  title: Scalars['String'];
  year: Scalars['Float'];
  imdbId: Scalars['String'];
  type: Scalars['String'];
  radarrMetadata: Scalars['String'];
  plexMetadata: Scalars['String'];
  omdbMetadata: Scalars['String'];
  tmdbMetadata: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  node?: Maybe<Node>;
  nodes?: Maybe<Array<Node>>;
  plexInstance: PlexInstance;
  plexInstances: Array<PlexInstance>;
  account: PlexAccount;
  radarrInstance: RadarrInstance;
  radarrInstances: Array<RadarrInstance>;
  settings: Settings;
  media: Array<Media>;
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

export type Mutation = {
  __typename?: 'Mutation';
  addPlexInstance: PlexInstance;
  upsertPlexInstance: PlexInstance;
  updatePlexInstance?: Maybe<PlexInstance>;
  removePlexInstance?: Maybe<PlexInstance>;
  updateUsers: Array<PlexUser>;
  addRadarrInstance: RadarrInstance;
  upsertRadarrInstance: RadarrInstance;
  updateRadarrInstance?: Maybe<RadarrInstance>;
  removeRadarrInstance?: Maybe<RadarrInstance>;
  updateSettings: Settings;
  updatePosterSettings: PosterGenerationSettings;
  runTask: Scalars['String'];
  previewPoster: Scalars['String'];
};


export type MutationAddPlexInstanceArgs = {
  input: AddPlexInstanceInput;
};


export type MutationUpsertPlexInstanceArgs = {
  input: UpsertPlexInstanceInput;
};


export type MutationUpdatePlexInstanceArgs = {
  input: UpdatePlexInstanceInput;
};


export type MutationRemovePlexInstanceArgs = {
  input: RemovePlexInstanceInput;
};


export type MutationUpdateUsersArgs = {
  input: Array<UpdateUserSharingInput>;
};


export type MutationAddRadarrInstanceArgs = {
  input: AddRadarrInstanceInput;
};


export type MutationUpsertRadarrInstanceArgs = {
  input: UpsertRadarrInstanceInput;
};


export type MutationUpdateRadarrInstanceArgs = {
  input: UpdateRadarrInstanceInput;
};


export type MutationRemoveRadarrInstanceArgs = {
  input: RemoveRadarrInstanceInput;
};


export type MutationUpdateSettingsArgs = {
  input: UpdateSettingsInput;
};


export type MutationUpdatePosterSettingsArgs = {
  input: PosterGenerationInput;
};


export type MutationRunTaskArgs = {
  input: RunTaskInput;
};


export type MutationPreviewPosterArgs = {
  input: PosterGenerationInput;
};

export type UpsertPlexInstanceInput = {
  /** URL of the Plex Server */
  url: Scalars['String'];
  /** Token for the Plex Server */
  token: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
};

export type RemovePlexInstanceInput = {
  id: Scalars['ID'];
};

export type UpsertRadarrInstanceInput = {
  url: Scalars['String'];
  apiKey: Scalars['String'];
  instanceName: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
};

export type RemoveRadarrInstanceInput = {
  id: Scalars['ID'];
};

export type UserFieldsFragment = (
  { __typename?: 'PlexUser' }
  & Pick<PlexUser, 'id' | 'title'>
  & { sharedServers: Array<(
    { __typename?: 'PlexSharedServer' }
    & Pick<PlexSharedServer, 'id' | 'machineIdentifier' | 'allLibraries'>
    & { libraries: Array<(
      { __typename?: 'PlexSharedLibrary' }
      & Pick<PlexSharedLibrary, 'id'>
    )> }
  )> }
);

export type RemovePlexInstanceMutationVariables = Exact<{
  input: RemovePlexInstanceInput;
}>;


export type RemovePlexInstanceMutation = (
  { __typename?: 'Mutation' }
  & { removePlexInstance?: Maybe<(
    { __typename?: 'PlexInstance' }
    & PlexFieldsFragment
  )> }
);

export type UpsertPlexInstanceMutationVariables = Exact<{
  input: UpsertPlexInstanceInput;
}>;


export type UpsertPlexInstanceMutation = (
  { __typename?: 'Mutation' }
  & { upsertPlexInstance: (
    { __typename?: 'PlexInstance' }
    & PlexFieldsFragment
  ) }
);

export type PlexFieldsFragment = (
  { __typename?: 'PlexInstance' }
  & Pick<PlexInstance, 'id' | 'friendlyName' | 'machineIdentifier' | 'token' | 'url'>
);

export type PreviewPosterMutationVariables = Exact<{
  input: PosterGenerationInput;
}>;


export type PreviewPosterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'previewPoster'>
);

export type UpsertRadarrInstanceMutationVariables = Exact<{
  input: UpsertRadarrInstanceInput;
}>;


export type UpsertRadarrInstanceMutation = (
  { __typename?: 'Mutation' }
  & { upsertRadarrInstance: (
    { __typename?: 'RadarrInstance' }
    & RadarrFieldsFragment
  ) }
);

export type RemoveRadarrInstanceMutationVariables = Exact<{
  input: RemoveRadarrInstanceInput;
}>;


export type RemoveRadarrInstanceMutation = (
  { __typename?: 'Mutation' }
  & { removeRadarrInstance?: Maybe<(
    { __typename?: 'RadarrInstance' }
    & RadarrFieldsFragment
  )> }
);

export type RadarrFieldsFragment = (
  { __typename?: 'RadarrInstance' }
  & Pick<RadarrInstance, 'id' | 'instanceName' | 'url' | 'apiKey'>
);

export type RunTaskMutationVariables = Exact<{
  input: RunTaskInput;
}>;


export type RunTaskMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'runTask'>
);

export type UpdatePosterSettingsMutationVariables = Exact<{
  input: PosterGenerationInput;
}>;


export type UpdatePosterSettingsMutation = (
  { __typename?: 'Mutation' }
  & { updatePosterSettings: (
    { __typename?: 'PosterGenerationSettings' }
    & PosterFieldsFragment
  ) }
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
    { __typename?: 'PlexUser' }
    & UserFieldsFragment
  )> }
);

export type GetMediaQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMediaQuery = (
  { __typename?: 'Query' }
  & { media: Array<(
    { __typename?: 'Media' }
    & Pick<Media, 'id' | 'title' | 'year' | 'type' | 'plexMetadata' | 'radarrMetadata' | 'omdbMetadata' | 'tmdbMetadata'>
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
      & PosterFieldsFragment
    ) }
  ), plexInstances: Array<(
    { __typename?: 'PlexInstance' }
    & PlexFieldsFragment
  )>, radarrInstances: Array<(
    { __typename?: 'RadarrInstance' }
    & RadarrFieldsFragment
  )> }
);

export type PosterFieldsFragment = (
  { __typename?: 'PosterGenerationSettings' }
  & Pick<PosterGenerationSettings, 'BLEND_MODE' | 'DESTINATION_OPACITY' | 'FONT_COLOUR' | 'GLOBAL_ICON_SCALE' | 'JPEG_QUALITY' | 'RATING_SCALE' | 'SOURCE_OPACITY' | 'SPACING' | 'BOX_COLOUR'>
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
    { __typename?: 'PlexAccount' }
    & { servers: Array<(
      { __typename?: 'PlexDeviceServer' }
      & Pick<PlexDeviceServer, 'id' | 'clientIdentifier' | 'name'>
      & { libraries: Array<(
        { __typename?: 'PlexSharedLibrary' }
        & Pick<PlexSharedLibrary, 'id' | 'title' | 'type'>
      )> }
    )>, users: Array<(
      { __typename?: 'PlexUser' }
      & UserFieldsFragment
    )> }
  ) }
);

export const UserFieldsFragmentDoc: DocumentNode<UserFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlexUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"sharedServers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"machineIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"allLibraries"}},{"kind":"Field","name":{"kind":"Name","value":"libraries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]};
export const PlexFieldsFragmentDoc: DocumentNode<PlexFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"plexFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlexInstance"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"friendlyName"}},{"kind":"Field","name":{"kind":"Name","value":"machineIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]};
export const RadarrFieldsFragmentDoc: DocumentNode<RadarrFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"radarrFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RadarrInstance"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"instanceName"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"apiKey"}}]}}]};
export const PosterFieldsFragmentDoc: DocumentNode<PosterFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"posterFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PosterGenerationSettings"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"BLEND_MODE"}},{"kind":"Field","name":{"kind":"Name","value":"DESTINATION_OPACITY"}},{"kind":"Field","name":{"kind":"Name","value":"FONT_COLOUR"}},{"kind":"Field","name":{"kind":"Name","value":"GLOBAL_ICON_SCALE"}},{"kind":"Field","name":{"kind":"Name","value":"JPEG_QUALITY"}},{"kind":"Field","name":{"kind":"Name","value":"RATING_SCALE"}},{"kind":"Field","name":{"kind":"Name","value":"SOURCE_OPACITY"}},{"kind":"Field","name":{"kind":"Name","value":"SPACING"}},{"kind":"Field","name":{"kind":"Name","value":"BOX_COLOUR"}}]}}]};
export const RemovePlexInstanceDocument: DocumentNode<RemovePlexInstanceMutation, RemovePlexInstanceMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removePlexInstance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemovePlexInstanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePlexInstance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"plexFields"}}]}}]}},...PlexFieldsFragmentDoc.definitions]};
export const UpsertPlexInstanceDocument: DocumentNode<UpsertPlexInstanceMutation, UpsertPlexInstanceMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"upsertPlexInstance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertPlexInstanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertPlexInstance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"plexFields"}}]}}]}},...PlexFieldsFragmentDoc.definitions]};
export const PreviewPosterDocument: DocumentNode<PreviewPosterMutation, PreviewPosterMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"previewPoster"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PosterGenerationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"previewPoster"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]};
export const UpsertRadarrInstanceDocument: DocumentNode<UpsertRadarrInstanceMutation, UpsertRadarrInstanceMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"upsertRadarrInstance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertRadarrInstanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertRadarrInstance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"radarrFields"}}]}}]}},...RadarrFieldsFragmentDoc.definitions]};
export const RemoveRadarrInstanceDocument: DocumentNode<RemoveRadarrInstanceMutation, RemoveRadarrInstanceMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeRadarrInstance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveRadarrInstanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeRadarrInstance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"radarrFields"}}]}}]}},...RadarrFieldsFragmentDoc.definitions]};
export const RunTaskDocument: DocumentNode<RunTaskMutation, RunTaskMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"runTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RunTaskInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"runTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]};
export const UpdatePosterSettingsDocument: DocumentNode<UpdatePosterSettingsMutation, UpdatePosterSettingsMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatePosterSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PosterGenerationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePosterSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"posterFields"}}]}}]}},...PosterFieldsFragmentDoc.definitions]};
export const UpdateSettingsDocument: DocumentNode<UpdateSettingsMutation, UpdateSettingsMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"plexAccountToken"}}]}}]}}]};
export const UpdateUsersDocument: DocumentNode<UpdateUsersMutation, UpdateUsersMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserSharingInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFields"}}]}}]}},...UserFieldsFragmentDoc.definitions]};
export const GetMediaDocument: DocumentNode<GetMediaQuery, GetMediaQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMedia"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"plexMetadata"}},{"kind":"Field","name":{"kind":"Name","value":"radarrMetadata"}},{"kind":"Field","name":{"kind":"Name","value":"omdbMetadata"}},{"kind":"Field","name":{"kind":"Name","value":"tmdbMetadata"}}]}}]}}]};
export const GetSettingsDocument: DocumentNode<GetSettingsQuery, GetSettingsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"plexAccountToken"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"omdbKey"}},{"kind":"Field","name":{"kind":"Name","value":"posterSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"posterFields"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"plexInstances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"plexFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"radarrInstances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"radarrFields"}}]}}]}},...PosterFieldsFragmentDoc.definitions,...PlexFieldsFragmentDoc.definitions,...RadarrFieldsFragmentDoc.definitions]};
export const GetSystemDocument: DocumentNode<GetSystemQuery, GetSystemQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"system"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"started"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]};
export const GetUsersDocument: DocumentNode<GetUsersQuery, GetUsersQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"servers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"clientIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"libraries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userFields"}}]}}]}}]}},...UserFieldsFragmentDoc.definitions]};
export type SystemKeySpecifier = ('version' | 'tasks' | SystemKeySpecifier)[];
export type SystemFieldPolicy = {
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TaskKeySpecifier = ('name' | 'started' | 'completed' | 'status' | TaskKeySpecifier)[];
export type TaskFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	started?: FieldPolicy<any> | FieldReadFunction<any>,
	completed?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlexAccountKeySpecifier = ('id' | 'username' | 'uuid' | 'email' | 'token' | 'users' | 'devices' | 'servers' | PlexAccountKeySpecifier)[];
export type PlexAccountFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	username?: FieldPolicy<any> | FieldReadFunction<any>,
	uuid?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	users?: FieldPolicy<any> | FieldReadFunction<any>,
	devices?: FieldPolicy<any> | FieldReadFunction<any>,
	servers?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlexUserKeySpecifier = ('id' | 'title' | 'username' | 'recommendationsPlaylistId' | 'thumb' | 'protected' | 'home' | 'allowTuners' | 'allowSync' | 'allowChannels' | 'allowCameraUpload' | 'allowSubtitleAdmin' | 'filterAll' | 'filterMovies' | 'filterMusic' | 'filterPhotos' | 'filterTelevision' | 'email' | 'sharedServers' | PlexUserKeySpecifier)[];
export type PlexUserFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	username?: FieldPolicy<any> | FieldReadFunction<any>,
	recommendationsPlaylistId?: FieldPolicy<any> | FieldReadFunction<any>,
	thumb?: FieldPolicy<any> | FieldReadFunction<any>,
	protected?: FieldPolicy<any> | FieldReadFunction<any>,
	home?: FieldPolicy<any> | FieldReadFunction<any>,
	allowTuners?: FieldPolicy<any> | FieldReadFunction<any>,
	allowSync?: FieldPolicy<any> | FieldReadFunction<any>,
	allowChannels?: FieldPolicy<any> | FieldReadFunction<any>,
	allowCameraUpload?: FieldPolicy<any> | FieldReadFunction<any>,
	allowSubtitleAdmin?: FieldPolicy<any> | FieldReadFunction<any>,
	filterAll?: FieldPolicy<any> | FieldReadFunction<any>,
	filterMovies?: FieldPolicy<any> | FieldReadFunction<any>,
	filterMusic?: FieldPolicy<any> | FieldReadFunction<any>,
	filterPhotos?: FieldPolicy<any> | FieldReadFunction<any>,
	filterTelevision?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	sharedServers?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlexSharedServerKeySpecifier = ('id' | 'name' | 'ownerId' | 'invitedId' | 'invitedEmail' | 'serverId' | 'accepted' | 'acceptedAt' | 'deletedAt' | 'leftAt' | 'owned' | 'inviteToken' | 'machineIdentifier' | 'lastSeenAt' | 'numLibraries' | 'allLibraries' | 'libraries' | PlexSharedServerKeySpecifier)[];
export type PlexSharedServerFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	invitedId?: FieldPolicy<any> | FieldReadFunction<any>,
	invitedEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	serverId?: FieldPolicy<any> | FieldReadFunction<any>,
	accepted?: FieldPolicy<any> | FieldReadFunction<any>,
	acceptedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	deletedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	leftAt?: FieldPolicy<any> | FieldReadFunction<any>,
	owned?: FieldPolicy<any> | FieldReadFunction<any>,
	inviteToken?: FieldPolicy<any> | FieldReadFunction<any>,
	machineIdentifier?: FieldPolicy<any> | FieldReadFunction<any>,
	lastSeenAt?: FieldPolicy<any> | FieldReadFunction<any>,
	numLibraries?: FieldPolicy<any> | FieldReadFunction<any>,
	allLibraries?: FieldPolicy<any> | FieldReadFunction<any>,
	libraries?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlexSharedLibraryKeySpecifier = ('id' | 'key' | 'title' | 'type' | PlexSharedLibraryKeySpecifier)[];
export type PlexSharedLibraryFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	key?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlexDeviceConnectionKeySpecifier = ('uri' | PlexDeviceConnectionKeySpecifier)[];
export type PlexDeviceConnectionFieldPolicy = {
	uri?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlexDeviceKeySpecifier = ('name' | 'publicAddress' | 'product' | 'productVersion' | 'platform' | 'platformVersion' | 'device' | 'model' | 'vendor' | 'provides' | 'clientIdentifier' | 'version' | 'id' | 'token' | 'createdAt' | 'lastSeenAt' | 'connection' | PlexDeviceKeySpecifier)[];
export type PlexDeviceFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	publicAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	platform?: FieldPolicy<any> | FieldReadFunction<any>,
	platformVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	device?: FieldPolicy<any> | FieldReadFunction<any>,
	model?: FieldPolicy<any> | FieldReadFunction<any>,
	vendor?: FieldPolicy<any> | FieldReadFunction<any>,
	provides?: FieldPolicy<any> | FieldReadFunction<any>,
	clientIdentifier?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	lastSeenAt?: FieldPolicy<any> | FieldReadFunction<any>,
	connection?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlexDeviceServerKeySpecifier = ('name' | 'publicAddress' | 'product' | 'productVersion' | 'platform' | 'platformVersion' | 'device' | 'model' | 'vendor' | 'provides' | 'clientIdentifier' | 'version' | 'id' | 'token' | 'createdAt' | 'lastSeenAt' | 'connection' | 'libraries' | PlexDeviceServerKeySpecifier)[];
export type PlexDeviceServerFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	publicAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	platform?: FieldPolicy<any> | FieldReadFunction<any>,
	platformVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	device?: FieldPolicy<any> | FieldReadFunction<any>,
	model?: FieldPolicy<any> | FieldReadFunction<any>,
	vendor?: FieldPolicy<any> | FieldReadFunction<any>,
	provides?: FieldPolicy<any> | FieldReadFunction<any>,
	clientIdentifier?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	lastSeenAt?: FieldPolicy<any> | FieldReadFunction<any>,
	connection?: FieldPolicy<any> | FieldReadFunction<any>,
	libraries?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PosterGenerationSettingsKeySpecifier = ('SOURCE_OPACITY' | 'DESTINATION_OPACITY' | 'BLEND_MODE' | 'SPACING' | 'GLOBAL_ICON_SCALE' | 'RATING_SCALE' | 'FONT_COLOUR' | 'IMAGE_HEIGHT' | 'IMAGE_WIDTH' | 'JPEG_QUALITY' | 'BOX_COLOUR' | PosterGenerationSettingsKeySpecifier)[];
export type PosterGenerationSettingsFieldPolicy = {
	SOURCE_OPACITY?: FieldPolicy<any> | FieldReadFunction<any>,
	DESTINATION_OPACITY?: FieldPolicy<any> | FieldReadFunction<any>,
	BLEND_MODE?: FieldPolicy<any> | FieldReadFunction<any>,
	SPACING?: FieldPolicy<any> | FieldReadFunction<any>,
	GLOBAL_ICON_SCALE?: FieldPolicy<any> | FieldReadFunction<any>,
	RATING_SCALE?: FieldPolicy<any> | FieldReadFunction<any>,
	FONT_COLOUR?: FieldPolicy<any> | FieldReadFunction<any>,
	IMAGE_HEIGHT?: FieldPolicy<any> | FieldReadFunction<any>,
	IMAGE_WIDTH?: FieldPolicy<any> | FieldReadFunction<any>,
	JPEG_QUALITY?: FieldPolicy<any> | FieldReadFunction<any>,
	BOX_COLOUR?: FieldPolicy<any> | FieldReadFunction<any>
};
export type NodeKeySpecifier = ('id' | NodeKeySpecifier)[];
export type NodeFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RadarrQualityProfileKeySpecifier = ('id' | 'name' | 'upgradeAllowed' | 'language' | RadarrQualityProfileKeySpecifier)[];
export type RadarrQualityProfileFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	upgradeAllowed?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RadarrLanguageKeySpecifier = ('id' | 'name' | RadarrLanguageKeySpecifier)[];
export type RadarrLanguageFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type AbsPlexDeviceKeySpecifier = ('name' | 'publicAddress' | 'product' | 'productVersion' | 'platform' | 'platformVersion' | 'device' | 'model' | 'vendor' | 'provides' | 'clientIdentifier' | 'version' | 'id' | 'token' | 'createdAt' | 'lastSeenAt' | 'connection' | AbsPlexDeviceKeySpecifier)[];
export type AbsPlexDeviceFieldPolicy = {
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	publicAddress?: FieldPolicy<any> | FieldReadFunction<any>,
	product?: FieldPolicy<any> | FieldReadFunction<any>,
	productVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	platform?: FieldPolicy<any> | FieldReadFunction<any>,
	platformVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	device?: FieldPolicy<any> | FieldReadFunction<any>,
	model?: FieldPolicy<any> | FieldReadFunction<any>,
	vendor?: FieldPolicy<any> | FieldReadFunction<any>,
	provides?: FieldPolicy<any> | FieldReadFunction<any>,
	clientIdentifier?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	lastSeenAt?: FieldPolicy<any> | FieldReadFunction<any>,
	connection?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SettingsKeySpecifier = ('id' | 'language' | 'plexAccountToken' | 'omdbKey' | 'tmdbKey' | 'posterSettings' | 'port' | SettingsKeySpecifier)[];
export type SettingsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	language?: FieldPolicy<any> | FieldReadFunction<any>,
	plexAccountToken?: FieldPolicy<any> | FieldReadFunction<any>,
	omdbKey?: FieldPolicy<any> | FieldReadFunction<any>,
	tmdbKey?: FieldPolicy<any> | FieldReadFunction<any>,
	posterSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	port?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PlexInstanceKeySpecifier = ('id' | 'machineIdentifier' | 'friendlyName' | 'url' | 'token' | PlexInstanceKeySpecifier)[];
export type PlexInstanceFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	machineIdentifier?: FieldPolicy<any> | FieldReadFunction<any>,
	friendlyName?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RadarrInstanceKeySpecifier = ('id' | 'url' | 'apiKey' | 'instanceName' | RadarrInstanceKeySpecifier)[];
export type RadarrInstanceFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>,
	apiKey?: FieldPolicy<any> | FieldReadFunction<any>,
	instanceName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('id' | 'username' | 'settings' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	username?: FieldPolicy<any> | FieldReadFunction<any>,
	settings?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MediaKeySpecifier = ('id' | 'title' | 'year' | 'imdbId' | 'type' | 'radarrMetadata' | 'plexMetadata' | 'omdbMetadata' | 'tmdbMetadata' | MediaKeySpecifier)[];
export type MediaFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	year?: FieldPolicy<any> | FieldReadFunction<any>,
	imdbId?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	radarrMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	plexMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	omdbMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	tmdbMetadata?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('node' | 'nodes' | 'plexInstance' | 'plexInstances' | 'account' | 'radarrInstance' | 'radarrInstances' | 'settings' | 'media' | 'system' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	node?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	plexInstance?: FieldPolicy<any> | FieldReadFunction<any>,
	plexInstances?: FieldPolicy<any> | FieldReadFunction<any>,
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	radarrInstance?: FieldPolicy<any> | FieldReadFunction<any>,
	radarrInstances?: FieldPolicy<any> | FieldReadFunction<any>,
	settings?: FieldPolicy<any> | FieldReadFunction<any>,
	media?: FieldPolicy<any> | FieldReadFunction<any>,
	system?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('addPlexInstance' | 'upsertPlexInstance' | 'updatePlexInstance' | 'removePlexInstance' | 'updateUsers' | 'addRadarrInstance' | 'upsertRadarrInstance' | 'updateRadarrInstance' | 'removeRadarrInstance' | 'updateSettings' | 'updatePosterSettings' | 'runTask' | 'previewPoster' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	addPlexInstance?: FieldPolicy<any> | FieldReadFunction<any>,
	upsertPlexInstance?: FieldPolicy<any> | FieldReadFunction<any>,
	updatePlexInstance?: FieldPolicy<any> | FieldReadFunction<any>,
	removePlexInstance?: FieldPolicy<any> | FieldReadFunction<any>,
	updateUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	addRadarrInstance?: FieldPolicy<any> | FieldReadFunction<any>,
	upsertRadarrInstance?: FieldPolicy<any> | FieldReadFunction<any>,
	updateRadarrInstance?: FieldPolicy<any> | FieldReadFunction<any>,
	removeRadarrInstance?: FieldPolicy<any> | FieldReadFunction<any>,
	updateSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	updatePosterSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	runTask?: FieldPolicy<any> | FieldReadFunction<any>,
	previewPoster?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TypedTypePolicies = TypePolicies & {
	System?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SystemKeySpecifier | (() => undefined | SystemKeySpecifier),
		fields?: SystemFieldPolicy,
	},
	Task?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TaskKeySpecifier | (() => undefined | TaskKeySpecifier),
		fields?: TaskFieldPolicy,
	},
	PlexAccount?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlexAccountKeySpecifier | (() => undefined | PlexAccountKeySpecifier),
		fields?: PlexAccountFieldPolicy,
	},
	PlexUser?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlexUserKeySpecifier | (() => undefined | PlexUserKeySpecifier),
		fields?: PlexUserFieldPolicy,
	},
	PlexSharedServer?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlexSharedServerKeySpecifier | (() => undefined | PlexSharedServerKeySpecifier),
		fields?: PlexSharedServerFieldPolicy,
	},
	PlexSharedLibrary?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlexSharedLibraryKeySpecifier | (() => undefined | PlexSharedLibraryKeySpecifier),
		fields?: PlexSharedLibraryFieldPolicy,
	},
	PlexDeviceConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlexDeviceConnectionKeySpecifier | (() => undefined | PlexDeviceConnectionKeySpecifier),
		fields?: PlexDeviceConnectionFieldPolicy,
	},
	PlexDevice?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlexDeviceKeySpecifier | (() => undefined | PlexDeviceKeySpecifier),
		fields?: PlexDeviceFieldPolicy,
	},
	PlexDeviceServer?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlexDeviceServerKeySpecifier | (() => undefined | PlexDeviceServerKeySpecifier),
		fields?: PlexDeviceServerFieldPolicy,
	},
	PosterGenerationSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PosterGenerationSettingsKeySpecifier | (() => undefined | PosterGenerationSettingsKeySpecifier),
		fields?: PosterGenerationSettingsFieldPolicy,
	},
	Node?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | NodeKeySpecifier | (() => undefined | NodeKeySpecifier),
		fields?: NodeFieldPolicy,
	},
	RadarrQualityProfile?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RadarrQualityProfileKeySpecifier | (() => undefined | RadarrQualityProfileKeySpecifier),
		fields?: RadarrQualityProfileFieldPolicy,
	},
	RadarrLanguage?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RadarrLanguageKeySpecifier | (() => undefined | RadarrLanguageKeySpecifier),
		fields?: RadarrLanguageFieldPolicy,
	},
	AbsPlexDevice?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | AbsPlexDeviceKeySpecifier | (() => undefined | AbsPlexDeviceKeySpecifier),
		fields?: AbsPlexDeviceFieldPolicy,
	},
	Settings?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SettingsKeySpecifier | (() => undefined | SettingsKeySpecifier),
		fields?: SettingsFieldPolicy,
	},
	PlexInstance?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PlexInstanceKeySpecifier | (() => undefined | PlexInstanceKeySpecifier),
		fields?: PlexInstanceFieldPolicy,
	},
	RadarrInstance?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RadarrInstanceKeySpecifier | (() => undefined | RadarrInstanceKeySpecifier),
		fields?: RadarrInstanceFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	},
	Media?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MediaKeySpecifier | (() => undefined | MediaKeySpecifier),
		fields?: MediaFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	}
};