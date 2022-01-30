import React, { FC, useRef } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";

import { useWildMode, useSeeds, useRecommendations } from "./hooks";

import Navbar from "./Navbar";
import Seeds from "./Seeds";
import Item from "./Item";
import ItemSkeleton from "./ItemSkeleton";
import Start from "./Start";
import Logo from "./Logo";
import Copyright from "./Copyright";
import Filler from "./Filler";

const TuneView: FC = () => {
  const [seeds] = useSeeds();
  const { recommendations, isValidating } = useRecommendations();
  const previousRecommendationsCountRef = useRef<number>(10);

  previousRecommendationsCountRef.current =
    recommendations?.tracks?.length || 10;
  useWildMode();

  const anySeeds = seeds.size !== 0;

  return (
    <>
      <Box width="100vw" overflowX="hidden">
        <HStack spacing="0" justifyContent="center">
          <Box
            my="20px"
            width="100px"
            height="25px"
            display={["none", "block"]}
          >
            <Logo width="100%" height="100%" />
          </Box>
          <Filler n={8}>
            <Box
              flexShrink={0}
              width="100px"
              height={["25px", "auto"]}
              display={["block", "none"]}
            >
              <Logo />
            </Box>
          </Filler>
        </HStack>
      </Box>
      {anySeeds && <Seeds />}
      {anySeeds && (
        <VStack alignItems="start" p={3}>
          <Text
            fontSize="xs"
            fontWeight={900}
            py={2}
            textColor="pink.500"
            textShadow="1px 1px 0 var(--chakra-colors-pink-100), 1px 2px 0 var(--chakra-colors-pink-500)"
          >
            Recommendations
          </Text>
          {isValidating && (
            <Filler n={seeds.size > 10 ? seeds.size : 10}>
              <ItemSkeleton />
            </Filler>
          )}
          {!isValidating &&
            recommendations?.tracks &&
            recommendations?.tracks.map((item) => <Item item={item} />)}
          {!isValidating && !recommendations?.tracks && (
            <Box>No results. Try changing your filters.</Box>
          )}
        </VStack>
      )}
      {!anySeeds && <Start />}
      <Copyright layout="static" />
      <Navbar />
    </>
  );
};

export default TuneView;
