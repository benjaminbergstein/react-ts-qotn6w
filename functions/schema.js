import { gql } from "graphql-request";
export default gql `
  type Object {
    id: ID!
    type: ObjectType!
    data: String!
  }

  enum ObjectType {
    SPOTIFY_TRACK
  }

  type Playlist {
    id: ID!
    title: String!
    spotifyPlaylistId: ID!
    tracks: [ID!]!
  }

  type Query {
    allPlaylist: [Playlist]!
    getPlaylist(playlistId: ID!): Playlist!
    allObjects(type: ObjectType!): [Object]
    getObject(id: ID!, type: ObjectType!): Object!
  }

  input CreatePlaylistInput {
    id: ID
    title: String!
    spotifyPlaylistId: ID!
    tracks: [ID!]!
  }

  input CreateObjectInput {
    id: ID
    type: ObjectType!
    data: String!
  }

  type Mutation {
    createPlaylist(input: CreatePlaylistInput!): Playlist!
    deletePlaylist(playlistId: ID!): Playlist!
    putObject(input: CreateObjectInput!): Object!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
//# sourceMappingURL=schema.js.map