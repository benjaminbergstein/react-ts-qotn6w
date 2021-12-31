import unfetch from 'unfetch';
import { snakeCase } from 'snake-case';
import {
  fetch as fetchStorageItem,
  store as storeStorageItem,
} from './storage';

const getUrl = (host, path, query = undefined) => {
  const url = new URL(`https://${host}${path}`);
  url.search = new URLSearchParams(query).toString();
  return url.toString();
};

const fetch = async (
  path,
  { method = 'GET', query = undefined, body = undefined } = {}
) =>
  unfetch(getUrl('api.spotify.com', path, query), {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${fetchStorageItem('token')}`,
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

export const cacheStore = (item) => {
  storeStorageItem(`spotifyCache:${uri}`, item);
};

export const cacheGet = (uri) => fetchStorageItem(`spotifyCache:${uri}`);

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

export const filters = [
  'minDanceability',
  'maxDanceability',
  'minEnergy',
  'maxEnergy',
  'minPopularity',
  'maxPopularity',
  'minLoudness',
  'maxLoudness',
  'minValence',
  'maxValence',
  'minTempo',
  'maxTempo',
] as const;

export type RecommendFilter = typeof filters[number];

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

export const getAuthUrl = () => {
  return getUrl('accounts.spotify.com', '/authorize', {
    client_id: 'ab13746019ba4117bbb11e4bf1f606f0',
    response_type: 'token',
    redirect_uri: `https://${document.location.host}/`,
    scope:
      'user-modify-playback-state,playlist-modify-private,playlist-modify-public,user-read-currently-playing',
  });
};

export const getTokenFromUrl = () => {
  const url = new URL(
    `http://www.example.com?${document.location.hash.substr(1)}`
  );
  return url.searchParams.get('access_token');
};
