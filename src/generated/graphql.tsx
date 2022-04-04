export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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

export type CreateObjectInput = {
  data: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  type: ObjectType;
};

export type CreatePlaylistInput = {
  id?: InputMaybe<Scalars['ID']>;
  spotifyPlaylistId: Scalars['ID'];
  title: Scalars['String'];
  tracks: Array<Scalars['ID']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPlaylist: Playlist;
  deletePlaylist: Playlist;
  putObject: Object;
};


export type MutationCreatePlaylistArgs = {
  input: CreatePlaylistInput;
};


export type MutationDeletePlaylistArgs = {
  playlistId: Scalars['ID'];
};


export type MutationPutObjectArgs = {
  input: CreateObjectInput;
};

export type Object = {
  __typename?: 'Object';
  data: Scalars['String'];
  id: Scalars['ID'];
  type: ObjectType;
};

export enum ObjectType {
  SpotifyTrack = 'SPOTIFY_TRACK'
}

export type Playlist = {
  __typename?: 'Playlist';
  id: Scalars['ID'];
  spotifyPlaylistId: Scalars['ID'];
  title: Scalars['String'];
  tracks: Array<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  allPlaylist: Array<Maybe<Playlist>>;
  getObject: Object;
  getPlaylist: Playlist;
};


export type QueryGetObjectArgs = {
  id: Scalars['ID'];
  type: ObjectType;
};


export type QueryGetPlaylistArgs = {
  playlistId: Scalars['ID'];
};

export type CreatePlaylistMutationVariables = Exact<{
  title: Scalars['String'];
  spotifyPlaylistId: Scalars['ID'];
  tracks: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type CreatePlaylistMutation = { __typename?: 'Mutation', createPlaylist: { __typename?: 'Playlist', id: string, title: string, spotifyPlaylistId: string, tracks: Array<string> } };

export type GetObjectQueryVariables = Exact<{
  id: Scalars['ID'];
  type: ObjectType;
}>;


export type GetObjectQuery = { __typename?: 'Query', getObject: { __typename?: 'Object', id: string, type: ObjectType, data: string } };

export type GetPlaylistQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPlaylistQuery = { __typename?: 'Query', getPlaylist: { __typename?: 'Playlist', id: string, title: string, spotifyPlaylistId: string, tracks: Array<string> } };

export type PutObjectMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
  type: ObjectType;
  data: Scalars['String'];
}>;


export type PutObjectMutation = { __typename?: 'Mutation', putObject: { __typename?: 'Object', id: string, type: ObjectType, data: string } };
