import React, { FC } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";

import { useWildMode, useSeeds, useRecommendations } from "./hooks";

import Navbar from "./Navbar";
import Seeds from "./Seeds";
import Item from "./Item";
import ItemSkeleton from "./ItemSkeleton";
import Start from "./Start";
import Logo from "./Logo";

const TuneView: FC = () => {
  const [seeds] = useSeeds();
  const { recommendations, isValidating } = useRecommendations();

  useWildMode();

  const anySeeds = seeds.size !== 0;

  return (
    <>
      <HStack spacing="0" justifyContent="space-between">
        <Box height="20px" display="block">
          <Logo />
        </Box>
        <Box height="20px" display={["block", "none"]}>
          <Logo />
        </Box>
        <Box height="20px" display={["block", "none"]}>
          <Logo />
        </Box>
        <Box height="20px" display={["block", "none"]}>
          <Logo />
        </Box>
        <Box height="20px" display={["block", "none"]}>
          <Logo />
        </Box>
        <Box height="20px" display={["block", "none"]}>
          <Logo />
        </Box>
        <Box height="20px" display={["block", "none"]}>
          <Logo />
        </Box>
      </HStack>
      {anySeeds && (
        <Box
          bg="gray.50"
          p={3}
          mb={5}
          boxShadow="md"
          position="sticky"
          top="0px"
          left="0px"
          zIndex={1}
        >
          <Seeds />
        </Box>
      )}
      {anySeeds && (
        <VStack alignItems="start" p={3}>
          <Text color="gray.900" fontSize="xs" fontWeight={900} py={2}>
            Recommendations
          </Text>
          {isValidating && (
            <>
              <ItemSkeleton />
              <ItemSkeleton />
              <ItemSkeleton />
              <ItemSkeleton />
              <ItemSkeleton />
            </>
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
      <Navbar />
    </>
  );
};

export default TuneView;
