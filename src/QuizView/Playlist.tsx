import React, { FC, useEffect, useState } from "react";
import { Box, Heading, Spinner, VStack } from "@chakra-ui/react";

import { sentenceCase } from "change-case";
import {
  useQuizSelections,
  useQuizStep,
  useRecommendations,
  useSeeds,
  useSetting,
  useSliders,
  useTopTracks,
  useView,
} from "../hooks";
import Item from "../Item";
import { RecommendFilters } from "../spotify";
import Seeds from "../Seeds";

const map = {
  0: [0, 45],
  1: [25, 75],
  2: [55, 100],
};

const QuizView: React.FC = () => {
  const [tick, setTick] = useState<number>(+new Date());
  const render = () => {
    setTick(+new Date());
  };
  const [quizSelections] = useQuizSelections();
  const [_sliders, setSliders] = useSliders();
  const tracks = useTopTracks();
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
  }, [tick, seeds.size, recommendations]);

  return (
    <Box>
      {seeds.size !== 0 && <Seeds />}
      {seeds.size < 1 && (
        <VStack spacing="20px" p={3}>
          <Heading>Pick one of your top tracks to "seed" your playlist</Heading>
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

export default QuizView;
