import * as React from 'react';
import { useLocalStorageItem } from './storage';
import {
  currentlyPlaying,
  filters,
  listPlaylists,
  MyPlaylistsResponse,
  recommend,
  RecommendationsResponse,
  RecommendFilters,
  search,
  SearchResponse,
  SpotifyThing,
  Track,
} from './spotify';
import { Seeds, View, SelectFunctionType } from './types';
import {
  Playlist,
  getTokenFromUrl,
  queueAdd,
  cacheStore,
  playlistAdd,
} from './spotify';

import useSWR from 'swr';

export const useSliders = () =>
  useLocalStorageItem<RecommendFilters>(
    'sliders',
    filters.reduce(
      (acc, filter) => ({
        ...acc,
        [filter]: /min/.test(filter) ? 0 : 100,
      }),
      {} as RecommendFilters
    )
  );

export const useView = () => useLocalStorageItem('view', 'search' as View);
export const useQ = () => useLocalStorageItem<string>('q', '');

export const useSearch = () => {
  const [q] = useQ();
  const { data: results } = useSWR<SearchResponse>(q, async () => search(q));
  return results;
};

export const usePlaylist = () =>
  useLocalStorageItem<Playlist | undefined>('playlist', undefined);

export const useCurrentTrack = () => {
  const { data } = useSWR<{ item: Track }>('current-track', async () =>
    currentlyPlaying()
  );

  const currentTrack = data?.item;

  if (currentTrack) {
    enqueued.add(currentTrack.uri);
  }

  return currentTrack;
};

const enqueued = new Set();

const enqueue = (uri: string) => {
  if (enqueued.has(uri)) return;
  queueAdd(uri);
  enqueued.add(uri);
};

export const useSeeds = (): [
  Seeds,
  SelectFunctionType,
  typeof enqueued,
  typeof enqueue
] => {
  const [playlist] = usePlaylist();
  const [view, setView] = useView();
  const [seedsArr, setSeedsArr] = useLocalStorageItem<string[]>('seeds', []);

  const seeds = new Set(seedsArr);

  const select: SelectFunctionType =
    (item: SpotifyThing) => (e: React.MouseEvent) => {
      e.stopPropagation();
      cacheStore(item);

      const isDesired = !seeds.has(item.uri);
      isDesired ? seeds.add(item.uri) : seeds.delete(item.uri);
      if (isDesired && item.type === 'track') {
        if (playlist) {
          playlistAdd(playlist.id, [item.uri]);
        } else {
          enqueue(item.uri);
        }
      }
      setSeedsArr(Array.from(seeds));
      if (seeds.size === 5) {
        setView('tune');
      }
    };

  return [seeds, select, enqueued, enqueue];
};

export const useToken = () =>
  useLocalStorageItem<string | undefined>('token', undefined);

export const useCaptureToken = () => {
  const [token, setToken] = useToken();
  React.useEffect(() => {
    if (/#access_token/.test(document.location.hash)) {
      setToken(getTokenFromUrl());
      document.location = '' as unknown as Location;
    }
  }, []);
};

export const useMyPlaylists = () => {
  const { data: playlistsData } = useSWR<MyPlaylistsResponse>(
    'playlists',
    async () => listPlaylists()
  );

  return playlistsData?.items;
};

export const useRecommendations = () => {
  const [seeds] = useSeeds();
  const [sliders] = useSliders();
  const { data: recommendations } = useSWR<RecommendationsResponse>(
    seeds.size > 0
      ? [...Array.from(seeds), ...Object.values(sliders)].join(',')
      : null,
    async () => {
      const seedsArr = Array.from(seeds).slice(-5);
      return recommend(seedsArr, sliders);
    }
  );

  return recommendations;
};
