import * as React from "react";
import useSWR from "swr";
import { useLocalStorageItem } from "./storage";
import {
  currentlyPlaying,
  listPlaylists,
  MyPlaylistsResponse,
  recommend,
  RecommendationsResponse,
  RecommendFilters,
  search,
  SearchResponse,
  SpotifyThing,
  Track,
  whoami,
  Playlist,
  getTokenFromUrl,
  queueAdd,
  cacheStore,
  playlistAdd,
  defaultFilters,
} from "./spotify";
import { Seeds, SelectFunctionType } from "./types";

export const useSliders = () =>
  useLocalStorageItem<RecommendFilters>("sliders", defaultFilters);

export const useSetting = (setting, defaultValue = undefined) =>
  useLocalStorageItem(`setting:${setting}`, defaultValue);

export const useView = () => useLocalStorageItem("view", "authorize");
export const useQ = () => useLocalStorageItem<string>("q", "");

export const useSearch = () => {
  const [q] = useQ();
  const { data: results, isValidating } = useSWR<SearchResponse>(q, async () =>
    search(q)
  );
  return { results, isValidating };
};

export const usePlaylist = () =>
  useLocalStorageItem<Playlist | undefined>("playlist", undefined);

export const useCurrentTrack = () => {
  const { data } = useSWR<{ item: Track }>("current-track", async () =>
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
  typeof enqueue,
  () => void
] => {
  const [playlist] = usePlaylist();
  const [view, setView] = useView();
  const [seedsArr, setSeedsArr] = useLocalStorageItem<string[]>("seeds", []);

  const resetSeeds = () => {
    setSeedsArr([]);
  };

  const seeds = new Set(seedsArr);

  const select: SelectFunctionType =
    (item: SpotifyThing) => (e?: React.MouseEvent | React.ChangeEvent) => {
      if (e) e.stopPropagation();
      cacheStore(item);

      const isDesired = !seeds.has(item.uri);
      isDesired ? seeds.add(item.uri) : seeds.delete(item.uri);
      if (isDesired && item.type === "track") {
        if (playlist) {
          playlistAdd(playlist.id, [item.uri]);
        } else {
          enqueue(item.uri);
        }
      }
      setSeedsArr(Array.from(seeds));
      if (isDesired && view !== "tune") {
        setView("tune");
      }
    };

  return [seeds, select, enqueued, enqueue, resetSeeds];
};

export const useToken = () =>
  useLocalStorageItem<string | undefined>("token", undefined);

export const useCaptureToken = () => {
  const [token, setToken] = useToken();
  const [view, setView] = useView();
  React.useEffect(() => {
    if (/#access_token/.test(document.location.hash)) {
      setView("tune");
      setToken(getTokenFromUrl());
      document.location.hash = "";
    }
  }, []);
};

export const useMyPlaylists = () => {
  const { data: playlistsData } = useSWR<MyPlaylistsResponse>(
    "playlists",
    async () => listPlaylists()
  );

  return playlistsData?.items;
};

export const useRecommendations = () => {
  const [seeds] = useSeeds();
  const [sliders] = useSliders();
  const [berzerkMode] = useSetting("berzerkMode", false);

  const trueSeeds = new Array(seeds.size > 5 ? 5 : seeds.size)
    .fill("")
    .map((_, i) => {
      const r = berzerkMode
        ? Math.round(Math.random() * seeds.size)
        : seeds.size - i;
      return Array.from(seeds)[r % seeds.size];
    });

  const { data: recommendations, isValidating } =
    useSWR<RecommendationsResponse>(
      () =>
        seeds.size > 0
          ? [...Array.from(seeds), ...Object.values(sliders)].join(",")
          : null,
      async () => recommend(trueSeeds, sliders)
    );

  return { recommendations, isValidating, trueSeeds: new Set(trueSeeds) };
};

export const useMe = () => useSWR("me", whoami);

export const useAuthorization = () => {
  const { data, error, isValidating, ...swr } = useMe();
  const [view, setView] = useView();

  const isAuthorized = !error && data?.id;
  React.useEffect(() => {
    if (isValidating) return;
    if (!isAuthorized) {
      setView("authorize");
    }
  }, [isAuthorized]);
};

export const useBerzerkMode = () => {
  const [_, select] = useSeeds();
  const { recommendations, isValidating } = useRecommendations();
  const [berzerkMode] = useSetting("berzerkMode", false);

  React.useEffect(() => {
    if (!berzerkMode) return;
    if (!recommendations?.tracks?.length) return;

    const selection = Math.round(
      Math.random() * recommendations?.tracks?.length
    );
    const track = recommendations.tracks[selection];

    const timeout = setTimeout(() => {
      select(track)();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [berzerkMode, isValidating, recommendations?.tracks?.length]);
};
