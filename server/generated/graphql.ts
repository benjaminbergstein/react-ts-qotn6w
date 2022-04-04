/* eslint-disable */
import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type ObjectType =
  | 'SPOTIFY_TRACK';

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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateObjectInput: CreateObjectInput;
  CreatePlaylistInput: CreatePlaylistInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Mutation: ResolverTypeWrapper<{}>;
  Object: ResolverTypeWrapper<Object>;
  ObjectType: ObjectType;
  Playlist: ResolverTypeWrapper<Playlist>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CreateObjectInput: CreateObjectInput;
  CreatePlaylistInput: CreatePlaylistInput;
  ID: Scalars['ID'];
  Mutation: {};
  Object: Object;
  Playlist: Playlist;
  Query: {};
  String: Scalars['String'];
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createPlaylist?: Resolver<ResolversTypes['Playlist'], ParentType, ContextType, RequireFields<MutationCreatePlaylistArgs, 'input'>>;
  deletePlaylist?: Resolver<ResolversTypes['Playlist'], ParentType, ContextType, RequireFields<MutationDeletePlaylistArgs, 'playlistId'>>;
  putObject?: Resolver<ResolversTypes['Object'], ParentType, ContextType, RequireFields<MutationPutObjectArgs, 'input'>>;
};

export type ObjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Object'] = ResolversParentTypes['Object']> = {
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ObjectType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlaylistResolvers<ContextType = any, ParentType extends ResolversParentTypes['Playlist'] = ResolversParentTypes['Playlist']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  spotifyPlaylistId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tracks?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  allPlaylist?: Resolver<Array<Maybe<ResolversTypes['Playlist']>>, ParentType, ContextType>;
  getObject?: Resolver<ResolversTypes['Object'], ParentType, ContextType, RequireFields<QueryGetObjectArgs, 'id' | 'type'>>;
  getPlaylist?: Resolver<ResolversTypes['Playlist'], ParentType, ContextType, RequireFields<QueryGetPlaylistArgs, 'playlistId'>>;
};

export type Resolvers<ContextType = any> = {
  Mutation?: MutationResolvers<ContextType>;
  Object?: ObjectResolvers<ContextType>;
  Playlist?: PlaylistResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

