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

export type Query = {
  __typename?: 'Query';
  settings: Settings;
  testPlex: Scalars['Boolean'];
  account: PlexAccount;
};


export type QueryTestPlexArgs = {
  data: PlexSettingsInput;
};

export type Settings = {
  __typename?: 'Settings';
  id: Scalars['Int'];
  language: Scalars['String'];
  port: Scalars['Int'];
  plexAccountToken: Scalars['String'];
  plex: Array<PlexSettings>;
};

export type PlexSettings = {
  __typename?: 'PlexSettings';
  id: Scalars['Int'];
  friendlyName: Scalars['String'];
  machineIdentifier: Scalars['String'];
  url: Scalars['String'];
  token: Scalars['String'];
  settingsId: Scalars['Int'];
};

export type PlexSettingsInput = {
  /** URL of the Plex Server */
  url: Scalars['String'];
  /** Token for the Plex Server */
  token: Scalars['String'];
};

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
  Movie = 'movie',
  Music = 'music',
  Photo = 'photo',
  Show = 'show'
}

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

export type PlexDeviceConnection = {
  __typename?: 'PlexDeviceConnection';
  uri: Scalars['String'];
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

export type Mutation = {
  __typename?: 'Mutation';
  updateSettings: Settings;
  updatePlex: PlexSettings;
  deletePlex: PlexSettings;
  updateUsers: Array<PlexUser>;
  inviteUsers: Array<PlexUser>;
};


export type MutationUpdateSettingsArgs = {
  data: SettingsInput;
};


export type MutationUpdatePlexArgs = {
  data: PlexSettingsInput;
};


export type MutationDeletePlexArgs = {
  id: Scalars['Int'];
};


export type MutationUpdateUsersArgs = {
  data: Array<UpdateUserSharingInput>;
};


export type MutationInviteUsersArgs = {
  data: Array<UpdateUserSharingInput>;
};

export type SettingsInput = {
  plexAccountToken?: Maybe<Scalars['String']>;
  port?: Maybe<Scalars['Float']>;
  language?: Maybe<Scalars['String']>;
  plex?: Maybe<Array<PlexSettingsInput>>;
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

export type AddPlexMutationVariables = Exact<{
  data: PlexSettingsInput;
}>;


export type AddPlexMutation = (
  { __typename?: 'Mutation' }
  & { updatePlex: (
    { __typename?: 'PlexSettings' }
    & Pick<PlexSettings, 'id' | 'friendlyName' | 'machineIdentifier' | 'url' | 'token'>
  ) }
);

export type DeletePlexMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePlexMutation = (
  { __typename?: 'Mutation' }
  & { deletePlex: (
    { __typename?: 'PlexSettings' }
    & Pick<PlexSettings, 'id' | 'friendlyName' | 'machineIdentifier' | 'url' | 'token'>
  ) }
);

export type UpdateSettingsMutationVariables = Exact<{
  data: SettingsInput;
}>;


export type UpdateSettingsMutation = (
  { __typename?: 'Mutation' }
  & { updateSettings: (
    { __typename?: 'Settings' }
    & Pick<Settings, 'language' | 'port' | 'plexAccountToken'>
  ) }
);

export type UpdateUsersMutationVariables = Exact<{
  data: Array<UpdateUserSharingInput> | UpdateUserSharingInput;
}>;


export type UpdateUsersMutation = (
  { __typename?: 'Mutation' }
  & { updateUsers: Array<(
    { __typename?: 'PlexUser' }
    & Pick<PlexUser, 'id'>
    & { sharedServers: Array<(
      { __typename?: 'PlexSharedServer' }
      & Pick<PlexSharedServer, 'id' | 'machineIdentifier' | 'allLibraries'>
      & { libraries: Array<(
        { __typename?: 'PlexSharedLibrary' }
        & Pick<PlexSharedLibrary, 'id'>
      )> }
    )> }
  )> }
);

export type CheckPlexQueryVariables = Exact<{
  data: PlexSettingsInput;
}>;


export type CheckPlexQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'testPlex'>
);

export type GetSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsQuery = (
  { __typename?: 'Query' }
  & { settings: (
    { __typename?: 'Settings' }
    & Pick<Settings, 'language' | 'port' | 'plexAccountToken'>
    & { plex: Array<(
      { __typename?: 'PlexSettings' }
      & Pick<PlexSettings, 'id' | 'machineIdentifier' | 'friendlyName' | 'token' | 'url'>
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
      & Pick<PlexUser, 'id' | 'title'>
      & { sharedServers: Array<(
        { __typename?: 'PlexSharedServer' }
        & Pick<PlexSharedServer, 'id' | 'machineIdentifier' | 'allLibraries'>
        & { libraries: Array<(
          { __typename?: 'PlexSharedLibrary' }
          & Pick<PlexSharedLibrary, 'id'>
        )> }
      )> }
    )> }
  ) }
);


export const AddPlexDocument: DocumentNode<AddPlexMutation, AddPlexMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addPlex"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PlexSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePlex"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"friendlyName"}},{"kind":"Field","name":{"kind":"Name","value":"machineIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]};
export const DeletePlexDocument: DocumentNode<DeletePlexMutation, DeletePlexMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deletePlex"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePlex"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"friendlyName"}},{"kind":"Field","name":{"kind":"Name","value":"machineIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]};
export const UpdateSettingsDocument: DocumentNode<UpdateSettingsMutation, UpdateSettingsMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"plexAccountToken"}}]}}]}}]};
export const UpdateUsersDocument: DocumentNode<UpdateUsersMutation, UpdateUsersMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserSharingInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sharedServers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"machineIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"allLibraries"}},{"kind":"Field","name":{"kind":"Name","value":"libraries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]};
export const CheckPlexDocument: DocumentNode<CheckPlexQuery, CheckPlexQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"checkPlex"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PlexSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"testPlex"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}]}]}}]};
export const GetSettingsDocument: DocumentNode<GetSettingsQuery, GetSettingsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"plexAccountToken"}},{"kind":"Field","name":{"kind":"Name","value":"plex"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"machineIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"friendlyName"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};
export const GetUsersDocument: DocumentNode<GetUsersQuery, GetUsersQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"servers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"clientIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"libraries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"sharedServers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"machineIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"allLibraries"}},{"kind":"Field","name":{"kind":"Name","value":"libraries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]};