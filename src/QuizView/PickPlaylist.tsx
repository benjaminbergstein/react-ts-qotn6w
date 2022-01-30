import React, { useEffect, useState } from "react";
import { Box, Button, Heading, Spinner, VStack } from "@chakra-ui/react";

import { sentenceCase } from "change-case";
import {
  usePlaylistTracks,
  useQuizSelections,
  useQuizStep,
  useRecommendations,
  useRender,
  useSeeds,
  useSetting,
  useSliders,
  useTopTracks,
  useView,
} from "../hooks";
import Item from "../Item";
import { Playlist, RecommendFilters } from "../spotify";
import Seeds from "../Seeds";
import PlaylistsSelect from "../PlaylistsSelect";

const map = {
  0: [0, 45],
  1: [25, 75],
  2: [55, 100],
};

const PickPlaylist: React.FC = () => {
  const [playlist, setPlaylist] = useState<Playlist>(undefined);
  const { data: tracksResponse } = usePlaylistTracks(playlist?.id);
  const tracks = tracksResponse?.items;
  const render = useRender();
  const [_step, setQuizStep] = useQuizStep();
  const [quizSelections] = useQuizSelections();
  const [_sliders, setSliders] = useSliders();
  const { recommendations } = useRecommendations();
  const [seeds, select] = useSeeds();
  const targetSize = [10, 25, 50][quizSelections.size];
  const [_view, setView] = useView();
  const [_seedsDrawerOpen, setSeedsDrawerOpen] = useSetting(
    "drawerOpen",
    false
  );

  useEffect(() => {
    const slidersFromSelections = Object.entries(quizSelections).reduce(
      (acc, [slug, answer]) => {
        if (slug === "size") return acc;
        return {
          ...acc,
          [`min${sentenceCase(slug)}`]: map[answer][0],
          [`max${sentenceCase(slug)}`]: map[answer][1],
        };
      },
      {}
    );

    setSliders(slidersFromSelections as RecommendFilters);
  }, Object.entries(quizSelections));

  useEffect(() => {
    if (!recommendations?.tracks?.length) return;
    if (seeds.size >= targetSize) {
      setView("tune");
      setSeedsDrawerOpen(true);
      return;
    }
    try {
      const selection = Math.round(
        Math.random() * recommendations?.tracks?.length
      );

      const track = recommendations.tracks[selection];

      select(track)();
    } catch (e) {
      render();
    }
  }, [render.tick, seeds.size, recommendations]);

  return (
    <Box padding={3}>
      <PlaylistsSelect
        placeholder="Choose a playlist"
        label="Your playlists"
        onSelect={(playlist) => {
          setPlaylist(playlist);
        }}
      />
      {seeds.size !== 0 && <Seeds />}
      {tracks?.length > 0 && seeds.size < 1 && (
        <VStack spacing="20px" p={3}>
          <Heading>
            Pick one of these tracks from your playlist {playlist?.name} to
            "seed" your playlist
          </Heading>
          <Button
            onClick={() => {
              setQuizStep("generate");
            }}
            variant="outline"
            size="xs"
            width="100%"
          >
            Start from top songs instead.
          </Button>
          {tracks.map(({ track }) => (
            <Item item={track} />
          ))}
        </VStack>
      )}
      {seeds.size > 0 && (
        <VStack spacing="50px" height="90vh" align="center" justify="center">
          <Box flex={1} display="flex" alignItems="center">
            <Spinner size="xl" />
          </Box>
          <Heading px={2} flex={1}>
            Generating your playlist....
          </Heading>
        </VStack>
      )}
    </Box>
  );
};

export default PickPlaylist;
