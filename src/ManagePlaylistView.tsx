import React, { FC, useEffect } from "react";

import { sentenceCase } from "change-case";
import {
  useManagedPlaylists,
  useRecommendations,
  useRender,
  useRouter,
  useSliders,
} from "./hooks";
import { isServer } from "./constants";
import Item from "./Item";
import {
  addItemsToPlaylist,
  cacheGet,
  cacheStore,
  getPlaylist,
  RecommendFilters,
} from "./spotify";
import useSWR from "swr";
import { Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { answerMap } from "./QuizView/questions";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "./Navbar";

const PlaylistView: FC = () => {
  const render = useRender();
  const {
    args: [playlistId],
  } = useRouter();
  const isUpdatingRef = React.useRef<boolean>(false);
  const [managedPlaylists, setManagedPlaylists] = useManagedPlaylists();
  const playlist = managedPlaylists[playlistId];
  const { data: spotifyPlaylist, mutate: refetchSpotifyPlaylist } = useSWR(
    `spotify:playlist:${playlist.spotifyId}`,
    async () => getPlaylist(playlist.spotifyId)
  );
  const [_sliders, setSliders] = useSliders();
  const { recommendations } = useRecommendations(
    new Set(playlist.metadata.included)
  );
  const desiredSize = playlist.metadata.desiredSize;

  useEffect(() => {
    const slidersFromSelections = Object.entries(
      playlist.metadata.quizAnswers
    ).reduce((acc, [slug, answer]) => {
      return {
        ...acc,
        [`min${sentenceCase(slug)}`]: answerMap[answer][0],
        [`max${sentenceCase(slug)}`]: answerMap[answer][1],
      };
    }, {});

    setSliders(slidersFromSelections as RecommendFilters);
  }, Object.entries(playlist.metadata.quizAnswers));

  const name = spotifyPlaylist?.name;
  const trackUris =
    spotifyPlaylist?.tracks.items.map(({ track }) => track.uri) || [];

  const updatePlaylist = (fn) => {
    setManagedPlaylists((playlists) => {
      const oldPlaylist = playlists[playlistId];
      const newPlaylist = fn(oldPlaylist);
      return {
        ...playlists,
        [playlistId]: newPlaylist,
      };
    });
  };
  const increasePlaylistSize = () => {
    updatePlaylist(
      ({ metadata: { desiredSize, ...metadata }, ...oldPlaylist }) => ({
        ...oldPlaylist,
        metadata: {
          ...metadata,
          desiredSize: desiredSize + 1,
        },
      })
    );
  };

  useEffect(() => {
    if (!spotifyPlaylist) return;
    if (!recommendations) return;
    if (isUpdatingRef.current === true) return;
    const removed = new Set(playlist.metadata.included);
    trackUris.forEach((uri) => {
      removed.delete(uri);
    });

    isUpdatingRef.current = true;
    updatePlaylist((oldPlaylist) => {
      const oldIncluded = new Set(oldPlaylist.metadata.included);
      const oldRemoved = new Set(oldPlaylist.metadata.removed);
      Array.from(removed).forEach((uri) => {
        oldIncluded.delete(uri);
        oldRemoved.add(uri);
      });
      const newLength = oldIncluded.size;
      const tracksToAdd = desiredSize - newLength;
      if (recommendations?.tracks) {
        const [newTracks, promises] = new Array(tracksToAdd).fill("").reduce(
          ([newTracks, promises]) => {
            while (true) {
              const selection = Math.round(
                Math.random() * recommendations?.tracks?.length
              );
              const recommendedTrack = recommendations?.tracks[selection];
              const recommendedUri = recommendedTrack?.uri;
              if (
                recommendedUri &&
                !oldIncluded.has(recommendedUri) &&
                !oldRemoved.has(recommendedUri)
              ) {
                oldIncluded.add(recommendedUri);
                return [
                  [...newTracks, recommendedUri],
                  [...promises, cacheStore(recommendedTrack)],
                ];
              }
            }
          },
          [[], []] as [string[], Array<Promise<void>>]
        );
        Promise.all(promises)
          .then(() =>
            tracksToAdd > 0
              ? addItemsToPlaylist(playlist.spotifyId, newTracks.join(","))
              : Promise.resolve()
          )
          .then(() => refetchSpotifyPlaylist())
          .then(() => {
            isUpdatingRef.current = false;
            render();
          })
          .catch(() => {
            isUpdatingRef.current = false;
            render();
          });
      }

      return {
        ...oldPlaylist,
        name: spotifyPlaylist.name,
        metadata: {
          ...oldPlaylist.metadata,
          included: Array.from(oldIncluded),
          removed: Array.from(oldRemoved),
        },
      };
    });
  }, [
    playlist.metadata.included.join("|"),
    trackUris.join("|"),
    recommendations?.tracks.map(({ uri }) => uri).join("|"),
  ]);

  if (isServer) return null;
  if (!spotifyPlaylist) return null;

  return (
    <>
      <Box p={4}>
        <a href="/v/tune">
          <HStack alignItems="center" mb="32px">
            <Text fontSize="xs">
              <FaArrowLeft />
            </Text>
            <Text fontSize="xs">Back to Tuner</Text>
          </HStack>
        </a>
        <Heading size="xs" color="gray.500">
          Playlist
        </Heading>
        <Heading size="lg">{name}</Heading>
        <Heading size="sm">Tracks</Heading>
        <VStack my={4} spacing={2}>
          {trackUris
            .map((uri) => cacheGet(uri))
            .map((item) => (
              <Item item={item} />
            ))}
          <Button onClick={increasePlaylistSize}>+ Get another track</Button>
        </VStack>
        {playlist.metadata.removed.length > 0 && (
          <>
            <Heading size="sm">Removed</Heading>
            <VStack my={4} spacing={2}>
              {playlist.metadata.removed
                .map((uri) => cacheGet(uri))
                .map((item) => (
                  <Item item={item} />
                ))}
            </VStack>
          </>
        )}
      </Box>
      <Navbar />
    </>
  );
};

export default () => {
  if (isServer) return <>Loading playlist...</>;
  return <PlaylistView />;
};
