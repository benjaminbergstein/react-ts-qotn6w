import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Spinner,
  VStack,
} from "@chakra-ui/react";

import { sentenceCase } from "change-case";
import {
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
import { RecommendFilters } from "../spotify";
import Seeds from "../SeedsV2";
import { answerMap } from "./questions";
import ClearButton from "../ClearButton";

const Playlist: React.FC = () => {
  const [_step, setQuizStep] = useQuizStep();
  const render = useRender();
  const [quizSelections] = useQuizSelections();
  const [_sliders, setSliders] = useSliders();
  const tracks = useTopTracks();
  const { recommendations } = useRecommendations();
  const [seeds, select] = useSeeds();
  const targetSize = 10;
  const [_view, setView] = useView();
  const [_seedsDrawerOpen, setSeedsDrawerOpen] = useSetting(
    "drawerOpen",
    false
  );

  const tooFewRecommendations = recommendations?.tracks?.length < 10;
  useEffect(() => {
    const slidersFromSelections = Object.entries(quizSelections).reduce(
      (acc, [slug, answer]) => {
        return {
          ...acc,
          [`min${sentenceCase(slug)}`]: answerMap[answer][0],
          [`max${sentenceCase(slug)}`]: answerMap[answer][1],
        };
      },
      {}
    );

    setSliders(slidersFromSelections as RecommendFilters);
  }, Object.entries(quizSelections));

  useEffect(() => {
    if (!recommendations?.tracks?.length) return;
    if (tooFewRecommendations) return;
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
      console.error(e);
      render();
    }
  }, [render.tick, seeds.size, recommendations]);

  if (tooFewRecommendations) {
    return (
      <HStack>
        <Box>Sorry, too few recommendations.</Box>
        <ClearButton closeParent={() => {}} confirm={false} icon={false} />
      </HStack>
    );
  }
  return (
    <Box>
      {seeds.size !== 0 && <Seeds />}
      {seeds.size < 1 && (
        <VStack spacing="20px" p={3}>
          <Heading>Pick one of your top tracks to "seed" your playlist</Heading>
          <Button
            onClick={() => {
              setQuizStep("from-playlist");
            }}
            variant="outline"
            size="xs"
            width="100%"
          >
            Start from a playlist instead.
          </Button>
          {tracks?.data?.items.map((item) => (
            <Item item={item} />
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

export default Playlist;
