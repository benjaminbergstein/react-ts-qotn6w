import unfetch from "unfetch";
import graphql from "./graphql";
import { loader } from "graphql.macro";

import { snakeCase } from "snake-case";
import { httpProtocol, httpHost } from "./constants";
import {
  fetch as fetchStorageItem,
  store as storeStorageItem,
} from "./storage";
import {
  ObjectType,
  PutObjectMutation,
  PutObjectMutationVariables,
} from "./generated/graphql";

const PutObjectQuery = loader("./PutObject.graphql");

const getUrl = (host, path, query = undefined) => {
  const url = new URL(`https://${host}${path}`);
  url.search = new URLSearchParams(query).toString();
  return url.toString();
};

const SCOPES = [
  "user-modify-playback-state",
  "playlist-modify-private",
  "playlist-modify-public",
  "user-read-currently-playing",
  "user-top-read",
  "user-library-read",
];

type SpotifyError = Error & {
  code: string;
};

const CODES = {
  401: "not_authorized",
  404: "not_found",
};

const fetch = async (
  path,
  { method = "GET", query = undefined, body = undefined } = {}
) =>
  unfetch(getUrl("api.spotify.com", path, query), {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${fetchStorageItem("token")}`,
    },
    ...(body && { body: JSON.stringify(body) }),
  }).then((res) => {
    if (res.status > 399) {
      const error = new Error(CODES[res.status.toString()]);
      throw error;
    }
    return res.json();
  });

export type SpotifyThing = {
  uri: string;
  id: string;
  name: string;
  type: "artist" | "track";
};

export type Artist = SpotifyThing;

type Image = {
  url: string;
};

export type Album = SpotifyThing & {
  images: [Image, Image, Image];
};
export type Track = SpotifyThing & {
  artists: Array<Artist>;
  album: Album;
};

export type Playlist = SpotifyThing & {
  tracks: {
    items: { track: Track }[];
  };
};

export type SearchResponse = {
  tracks: {
    items: Array<Track>;
  };
};

export const cacheStore = async (item) => {
  console.log("Store!!");
  try {
    storeStorageItem(`spotifyCache:${item.uri}`, item);
    if (item.type === "track") {
      await graphql<PutObjectMutation, PutObjectMutationVariables>({
        query: PutObjectQuery,
        variables: {
          id: item.uri,
          type: ObjectType.SpotifyTrack,
          data: JSON.stringify(item),
        },
      });
    }
  } catch (e: unknown) {
    console.error(
      `An error occurred storing "spotifyCache:${item.uri}" to cache:`,
      e
    );
  }
};

export const cacheGet = (uri) => fetchStorageItem(`spotifyCache:${uri}`);

export const search = async (q, type = "track"): Promise<SearchResponse> =>
  fetch("/v1/search", {
    query: { q, type },
  });

export const getPlaylist = async (playlistId): Promise<Playlist> =>
  fetch(`/v1/playlists/${playlistId}`);

export const createPlaylist = async (userId, playlistName): Promise<Playlist> =>
  fetch(`/v1/users/${userId}/playlists`, {
    method: "POST",
    body: { name: playlistName, public: true },
  });

export const addItemsToPlaylist = async (
  playlistId: string,
  uris: string
): Promise<unknown> =>
  fetch(`/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    query: {
      uris,
    },
  });

export type RecommendationsResponse = {
  tracks: Track[];
};

export type MyPlaylistsResponse = {
  items: Playlist[];
};

export const queueAdd = async (uri: string) =>
  fetch("/v1/me/player/queue", {
    method: "POST",
    query: { uri },
  });

export const currentlyPlaying = async () =>
  fetch("/v1/me/player/currently-playing");

export const filters = [
  "minDanceability",
  "maxDanceability",
  "minEnergy",
  "maxEnergy",
  "minPopularity",
  "maxPopularity",
  // 'minLoudness',
  // 'maxLoudness',
  "minValence",
  "maxValence",
  "minTempo",
  "maxTempo",
] as const;

export const defaultFilters = filters.reduce(
  (acc, filter) => ({
    ...acc,
    [filter]: /min/.test(filter) ? 0 : 100,
  }),
  {} as RecommendFilters
);

export type RecommendFilter = typeof filters[number];

export type RecommendFilters = Record<RecommendFilter, number>;

export const filterScales: Partial<Record<RecommendFilter, number>> = {
  minPopularity: 100,
  maxPopularity: 100,
  minTempo: 200,
  maxTempo: 200,
};

export type TopTracksResponse = {
  items: Track[];
};

export const top = async (): Promise<TopTracksResponse> =>
  fetch("/v1/me/top/tracks");

const getScaledValue = (value, scale) => {
  const val = (value / 100) * (scale || 1);
  if (val < 1) return val;
  return Math.floor(val);
};

export const recommend = async (
  seeds: string[],
  recommendFilters: RecommendFilters
): Promise<RecommendationsResponse> =>
  fetch("/v1/recommendations", {
    query: {
      ...Object.entries(recommendFilters).reduce(
        (acc, [k, v]) => ({
          ...acc,
          [snakeCase(k)]: getScaledValue(v, filterScales[k]),
        }),
        {}
      ),
      ...seeds.reduce(
        (acc, uri) => {
          const item = cacheGet(uri);

          const key = `seed_${item.type}s`;
          const items = acc[key] !== "" ? acc[key].split(",") : [];
          items.push(item.id);
          return {
            ...acc,
            [key]: items.join(","),
          };
        },
        {
          seed_artists: "",
          seed_tracks: "",
        }
      ),
    },
  });

export const listPlaylists = async (
  limit: number = 50
): Promise<MyPlaylistsResponse> =>
  fetch("/v1/me/playlists", { query: { limit } });

type PlaylistTracksResponse = any;

export const listPlaylistTracks = async (
  playlistId: string
): Promise<PlaylistTracksResponse> =>
  fetch(`/v1/playlists/${playlistId}/tracks`);

export const playlistAdd = async (playlistId: string, uris: string[]) =>
  fetch(`/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    body: { uris },
  });

export const getAuthUrl = () => {
  const url = getUrl("accounts.spotify.com", "/authorize", {
    client_id: "ab13746019ba4117bbb11e4bf1f606f0",
    response_type: "token",
    redirect_uri: `${httpProtocol}//${httpHost}/`,
    scope: SCOPES.join(","),
  });
  return url;
};

export const getTokenFromUrl = () => {
  const url = new URL(
    `http://www.example.com?${document.location.hash.substr(1)}`
  );
  return url.searchParams.get("access_token");
};

export const whoami = async () => fetch("/v1/me");

export const isSongLiked = async (id: string) => {
  const res = await fetch("/v1/me/tracks/contains", {
    query: { ids: id },
  });
  return res[0];
};
