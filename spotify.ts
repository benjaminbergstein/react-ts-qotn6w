import unfetch from 'unfetch';
import { snakeCase } from 'snake-case';

const getUrl = (path, query = undefined) => {
  const url = new URL(`https://api.spotify.com${path}`);
  url.search = new URLSearchParams(query).toString();
  return url.toString();
};

const fetch = async (
  path,
  { method = 'GET', query = undefined, body = undefined } = {}
) =>
  unfetch(getUrl(path, query), {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ApiToken}`,
    },
    ...(body && { body: JSON.stringify(body) }),
  }).then((res) => res.json());

export type SpotifyThing = {
  uri: string;
  id: string;
  name: string;
  type: 'artist' | 'track';
};

export type Artist = SpotifyThing;

export type Track = SpotifyThing & {
  artists: Array<Artist>;
};

export type Playlist = SpotifyThing;

export type SearchResponse = {
  tracks: {
    items: Array<Track>;
  };
};

const cache = {};

export const cacheStore = (item) => {
  cache[item.uri] = item;
};

export const cacheGet = (uri) => cache[uri];

export const search = async (q, type = 'track'): Promise<SearchResponse> =>
  fetch('/v1/search', {
    query: { q, type },
  });

export type RecommendationsResponse = {
  tracks: Track[];
};

export type MyPlaylistsResponse = {
  items: Playlist[];
};

export const queueAdd = async (uri: string) =>
  fetch('/v1/me/player/queue', {
    method: 'POST',
    query: { uri },
  });

export const currentlyPlaying = async () =>
  fetch('/v1/me/player/currently-playing');

const filters = [
  'danceability',
  'energy',
  'popularity',
  'loudness',
  'valence',
  'tempo',
] as const;

type Filter = Capitalize<typeof filters[number]>;
type MinMax = 'min' | 'max';
export type RecommendFilter = `${MinMax}${Filter}`;

export type RecommendFilters = Record<RecommendFilter, number>;

export const recommend = async (
  seeds: string[],
  recommendFilters: RecommendFilters
): Promise<RecommendationsResponse> =>
  fetch('/v1/recommendations', {
    query: {
      ...Object.entries(recommendFilters).reduce(
        (acc, [k, v]) => ({
          ...acc,
          [snakeCase(k)]: v,
        }),
        {}
      ),
      ...seeds.reduce(
        (acc, uri) => {
          const item = cacheGet(uri);

          const key = `seed_${item.type}s`;
          const items = acc[key] !== '' ? acc[key].split(',') : [];
          items.push(item.id);
          return {
            ...acc,
            [key]: items.join(','),
          };
        },
        {
          seed_artists: '',
          seed_tracks: '',
        }
      ),
    },
  });

export const listPlaylists = async (
  limit: number = 50
): Promise<MyPlaylistsResponse> =>
  fetch('/v1/me/playlists', { query: { limit } });

export const playlistAdd = async (playlistId: string, uris: string[]) =>
  fetch(`/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    body: { uris },
  });
