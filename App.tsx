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
} from '@chakra-ui/react';

import { cacheGet, Track, Artist, filters, getAuthUrl } from './spotify';

import {
  useView,
  useQ,
  useSliders,
  usePlaylist,
  useSeeds,
  useCaptureToken,
  useMyPlaylists,
  useSearch,
  useCurrentTrack,
  useRecommendations,
} from './hooks';
import { Seeds } from './types';
import FilterSlider from './FilterSlider';

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

const App: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const selectRef = React.useRef<HTMLSelectElement>(null);

  const [_view, setView] = useView();
  const view = 'search';
  const [q, setQ] = useQ();
  const results = useSearch();

  const [seeds, select, enqueued, enqueue] = useSeeds();

  const [_playlist, setPlaylist] = usePlaylist();

  const playlists = useMyPlaylists();

  const [sliders, setSliders] = useSliders();

  useCaptureToken();

  const currentTrack = useCurrentTrack();

  const recommendations = useRecommendations();

  const handleSelect = () => {
    const val = selectRef?.current?.value;
    setPlaylist(val ? JSON.parse(val) : undefined);
  };

  const performSearch = async () => {
    const newQ = inputRef.current.value;
    document.location.hash = newQ;
    setQ(newQ);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  React.useEffect(() => {
    performSearch();
  }, []);

  return (
    <React.Fragment>
      <a href={getAuthUrl()}>
        <Button>Authorize</Button>
      </a>
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
        <React.Fragment>
          <Box>
            <Button onClick={() => setView('search')}>
              &larr; Back to search
            </Button>
          </Box>
          <Box>
            {Array.from(seeds)
              .map((uri) => cacheGet(uri))
              .map((item) => (
                <Item {...{ select, seeds, item }} />
              ))}
            {filters.map((filter) => (
              <FilterSlider filter={filter} {...{ sliders, setSliders }} />
            ))}
            {recommendations?.tracks &&
              recommendations?.tracks.map((item) => (
                <Item {...{ select, seeds, item }} />
              ))}
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default App;
