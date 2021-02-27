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
};

export type Query = {
  __typename?: 'Query';
  settings: Settings;
};

export type Settings = {
  __typename?: 'Settings';
  id: Scalars['Int'];
  language: Scalars['String'];
  port: Scalars['Int'];
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

export type Mutation = {
  __typename?: 'Mutation';
  updateSettings: Settings;
  updatePlex: PlexSettings;
};


export type MutationUpdateSettingsArgs = {
  data: SettingsInput;
};


export type MutationUpdatePlexArgs = {
  data: PlexSettingsInput;
};

export type SettingsInput = {
  port?: Maybe<Scalars['Float']>;
  language?: Maybe<Scalars['String']>;
  plex?: Maybe<Array<PlexSettingsInput>>;
};

export type PlexSettingsInput = {
  /** URL of the Plex Server */
  url: Scalars['String'];
  /** Token for the Plex Server */
  token: Scalars['String'];
};

export type GetSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsQuery = (
  { __typename?: 'Query' }
  & { settings: (
    { __typename?: 'Settings' }
    & Pick<Settings, 'language' | 'port'>
    & { plex: Array<(
      { __typename?: 'PlexSettings' }
      & Pick<PlexSettings, 'machineIdentifier' | 'friendlyName' | 'token' | 'url'>
    )> }
  ) }
);


export const GetSettingsDocument: DocumentNode<GetSettingsQuery, GetSettingsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"port"}},{"kind":"Field","name":{"kind":"Name","value":"plex"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"machineIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"friendlyName"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]};