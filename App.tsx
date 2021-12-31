import * as React from 'react';
import {
  InputGroup,
  InputLeftElement,
  Input,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Checkbox,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Divider,
  Select,
  RecommendFilter,
  RecommendFilters,
} from '@chakra-ui/react';

import {
  cacheStore,
  cacheGet,
  search,
  recommend,
  queueAdd,
  listPlaylists,
  currentlyPlaying,
  SearchResponse,
  RecommendationsResponse,
  Track,
  Artist,
  Playlist,
  playlistAdd,
  RecommendFilters,
  RecommendFilters,
  MyPlaylistsResponse,
} from './spotify';

import { pascalCase, sentenceCase } from 'change-case';

import useSWR from 'swr';

type Seeds = Set<string>;

type View = 'search' | 'tune';

const enqueued = new Set();

const enqueue = (uri: string) => {
  if (enqueued.has(uri)) return;
  queueAdd(uri);
  enqueued.add(uri);
};

type ItemProps = {
  select: (item: Track | Artist) => void;
  seeds: Seeds;
  item: Track | Artist;
};

const Item: React.FC<ItemProps> = ({ select, seeds, item }) => (
  <Flex width="100%" direction="row" m={2}>
    <Button onClick={select(item)} width="100%">
      <Checkbox
        mr={2}
        onChange={select(item)}
        isChecked={seeds.has(item.uri)}
      />
      <Box flex={1}>
        <Box>
          <Text fontSize={18} color="gray.900">
            {item.name}
          </Text>
        </Box>
        <Box flex={1}>
          <Text fontSize={14} color="gray.600">
            {item.type === 'artist'
              ? ' (artist)'
              : ` ${(item as Track).artists[0].name}`}
          </Text>
        </Box>
      </Box>
    </Button>
  </Flex>
);

const FilterSlider: React.FC<{
  filter: RecommendFilter;
  sliders: RecommendFilters;
  setSliders: React.SetStateAction<RecommendFilters>;
}> = ({ filter, sliders, setSliders }) => (
  <Box>
    <Heading size="s">
      {sentenceCase(filter)} - {sliders[filter] * 100}%
    </Heading>
    <Slider
      aria-label="slider-ex-1"
      defaultValue={sliders[filter] * 100}
      onChange={(val) =>
        setSliders((sliders) => ({ ...sliders, [filter]: val / 100 }))
      }
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  </Box>
);

const App: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const [view, setView] = React.useState<View>('search' as View);
  const [_, tick] = React.useState<number>(+new Date());
  const render = () => tick(+new Date());
  const [q, setQ] = React.useState<string>(null);
  const [seeds] = React.useState<Seeds>(new Set());
  const [playlist, setPlaylist] = React.useState<Playlist>(undefined);
  const { data: results } = useSWR<SearchResponse>(q, async () => search(q));

  const { data: playlistsData } = useSWR<MyPlaylistsResponse>(
    'playlists',
    async () => listPlaylists()
  );

  const playlists = playlistsData?.items;
  const handleSelect = () => {
    const val = selectRef?.current?.value;
    setPlaylist(val ? JSON.parse(val) : undefined);
  };
  const { data } = useSWR<{ item: Track }>('current-track', async () =>
    currentlyPlaying()
  );

  const currentTrack = data?.item;
  if (currentTrack) {
    enqueued.add(currentTrack.uri);
  }
  const [sliders, setSliders] = React.useState<RecommendFilters>({
    minDanceability: 0,
    maxDanceability: 1,
    minEnergy: 0,
    maxEnergy: 1,
  });

  const { data: recommendations } = useSWR<RecommendationsResponse>(
    seeds.size > 0
      ? [...Array.from(seeds), ...Object.values(sliders)].join(',')
      : null,
    async () => {
      const seedsArr = Array.from(seeds).slice(-5);
      return recommend(seedsArr, sliders);
    }
  );

  const performSearch = async () => {
    const newQ = inputRef.current.value;
    document.location.hash = newQ;
    setQ(newQ);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const select = (item) => (e: React.MouseEvent) => {
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
    render();
    if (seeds.size === 5) {
      setView('tune');
    }
  };

  React.useEffect(() => {
    performSearch();
  }, []);

  return (
    <React.Fragment>
      {playlists && (
        <Select
          ref={selectRef}
          onChange={handleSelect}
          placeholder="— Select a playlist to add to —"
        >
          {playlists.map((playlist) => (
            <option value={JSON.stringify(playlist)}>{playlist.name}</option>
          ))}
        </Select>
      )}
      {view === 'search' && (
        <VStack spacing="10px">
          <Heading size="xl">Spotify Tuner</Heading>
          <Heading size="m">How does this work?</Heading>
          <VStack spacing="15px" maxWidth="500px">
            <Text fontSize="xs">
              Start from your currently playing track (by clicking below), or
              perform a search and then click a track or artist to seed
              recommendations.
            </Text>
            <Text fontSize="xs">
              When you're ready, click "Start tuning ➡️" below. Any song you
              check will be added to your queue.
            </Text>
          </VStack>
          {seeds.size > 0 && (
            <React.Fragment>
              <Divider />
              <Button onClick={() => setView('tune')} type="button">
                Start tuning ➡
              </Button>
            </React.Fragment>
          )}
          <Divider />
          {currentTrack && (
            <React.Fragment>
              <Box>
                <Text>Currently playing</Text>
              </Box>

              <Box width="100%">
                <Item {...{ select, seeds, item: currentTrack }} />
              </Box>
            </React.Fragment>
          )}
          <Divider />
          <Box>
            <Text>Or, search</Text>
          </Box>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <InputLeftElement pointerEvents="none" />
              <Input
                defaultValue={decodeURIComponent(
                  document.location.hash.replace(/\#/, '')
                )}
                ref={inputRef}
                type="search"
                placeholder="Search"
              />
              <Button type="submit">🔎</Button>
            </InputGroup>
          </form>

          {results?.tracks?.items &&
            results?.tracks?.items.map((track) => (
              <React.Fragment>
                <Item {...{ select, seeds, item: track }} />
                <Item {...{ select, seeds, item: track.artists[0] }} />
              </React.Fragment>
            ))}
        </VStack>
      )}
      {view === 'tune' && (
        <Box>
          {Array.from(seeds)
            .map((uri) => cacheGet(uri))
            .map((item) => (
              <Item {...{ select, seeds, item }} />
            ))}
          <FilterSlider filter="minDanceability" {...{ sliders, setSliders }} />
          <FilterSlider filter="maxDanceability" {...{ sliders, setSliders }} />
          <FilterSlider filter="minEnergy" {...{ sliders, setSliders }} />
          <FilterSlider filter="maxEnergy" {...{ sliders, setSliders }} />
          {recommendations?.tracks &&
            recommendations?.tracks.map((item) => (
              <Item {...{ select, seeds, item }} />
            ))}
        </Box>
      )}
    </React.Fragment>
  );
};

export default App;
