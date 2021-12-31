import React, { FC } from 'react';
import {
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Checkbox,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Divider,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

import { ChevronUpIcon, ChevronRightIcon } from '@chakra-ui/icons';

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
  useAuthorization,
} from './hooks';

import FilterSlider from './FilterSlider';
import Item from './Item';
import NavBar from './NavBar';
import LogOut from './LogOut';

const SearchField: FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [q, setQ] = useQ();
  const [view, setView] = useView();

  const performSearch = async () => {
    const newQ = inputRef.current.value;
    document.location.hash = newQ;
    setView('search');
    setQ(newQ);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children="
    🔎"
        />
        <Input
          defaultValue={decodeURIComponent(
            document.location.hash.replace(/\#/, '')
          )}
          ref={inputRef}
          type="search"
          placeholder="Search"
        />

        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" type="submit">
            🔎
          </Button>
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

const App: React.FC = () => {
  const selectRef = React.useRef<HTMLSelectElement>(null);

  const [view, setView] = useView();

  const results = useSearch();

  const [seeds, select] = useSeeds();

  const [_playlist, setPlaylist] = usePlaylist();

  const playlists = useMyPlaylists();

  const [sliders, setSliders] = useSliders();

  useAuthorization();
  useCaptureToken();

  const currentTrack = useCurrentTrack();

  const recommendations = useRecommendations();

  const handleSelect = () => {
    const val = selectRef?.current?.value;
    setPlaylist(val ? JSON.parse(val) : undefined);
  };

  return (
    <Box p="10px">
      <NavBar />
      {view === 'settings' && (
        <VStack>
          <Text fontSize="xs" color="gray.600">
            Where do you want to add tracks?
          </Text>
          <Divider />
          {playlists && (
            <Select
              ref={selectRef}
              onChange={handleSelect}
              placeholder="Add to queue"
            >
              <optgroup label="Add to playlist:">
                {playlists.map((playlist) => (
                  <option value={JSON.stringify(playlist)}>
                    {playlist.name}
                  </option>
                ))}
              </optgroup>
            </Select>
          )}
        </VStack>
      )}
      {view === 'authorize' && (
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
          <a href={getAuthUrl()}>
            <Button>Authorize Spotify</Button>
          </a>
        </VStack>
      )}
      {view === 'start' && (
        <>
          <Alert status="success">
            <AlertIcon />
            <AlertDescription>
              Let's get started! First, we need a song or artist to seed...
            </AlertDescription>
          </Alert>
          <Divider m={2} />
          {currentTrack && (
            <>
              <Box>
                <Text>You have something currently playing:</Text>
              </Box>
              <Item item={currentTrack} />

              <Box align="center">
                <Text>
                  ☝️ &nbsp;&nbsp;Click it to use it as your first
                  seed.&nbsp;&nbsp;👆
                </Text>
              </Box>

              <HStack my="30px">
                <Box flex="1">
                  <Divider />
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    textTransform="uppercase"
                  >
                    or
                  </Text>
                </Box>

                <Box flex="1">
                  <Divider />
                </Box>
              </HStack>
            </>
          )}

          <SearchField />
        </>
      )}
      {view === 'search' && (
        <>
          <VStack>
            <SearchField />

            {results?.tracks?.items &&
              results?.tracks?.items.map((track) => (
                <>
                  <Item item={track} />
                  <Item item={track.artists[0]} />
                </>
              ))}
          </VStack>
        </>
      )}
      {view === 'tune' && (
        <VStack>
          <HStack spacing="2px" wrap="wrap">
            {Array.from(seeds)
              .map((uri) => cacheGet(uri))
              .map((item) => (
                <Item {...{ select, seeds, item }} />
              ))}
          </HStack>
          {filters.map((filter) => (
            <FilterSlider filter={filter} {...{ sliders, setSliders }} />
          ))}
          {recommendations?.tracks &&
            recommendations?.tracks.map((item) => (
              <Item {...{ select, seeds, item }} />
            ))}
        </VStack>
      )}
      {view === 'logout' && <LogOut />}
    </Box>
  );
};

export default App;
