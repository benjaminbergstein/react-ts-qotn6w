import React, { FC } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";

import { useWildMode, useSeeds, useRecommendations } from "./hooks";

import Navbar from "./Navbar";
import Seeds from "./Seeds";
import Item from "./Item";
import ItemSkeleton from "./ItemSkeleton";
import Start from "./Start";
import Logo from "./Logo";
import Copyright from "./Copyright";

const TuneView: FC = () => {
  const [seeds] = useSeeds();
  const { recommendations, isValidating } = useRecommendations();

  useWildMode();

  const anySeeds = seeds.size !== 0;

  return (
    <>
      <HStack spacing="0" justifyContent="center">
        <Box my="20px" width="200px" height="50px" display={["none", "block"]}>
          <Logo />
        </Box>
        <Box width="100px" height="25px" display={["block", "none"]}>
          <Logo />
        </Box>
        <Box width="100px" height="25px" display={["block", "none"]}>
          <Logo />
        </Box>
        <Box width="100px" height="25px" display={["block", "none"]}>
          <Logo />
        </Box>
        <Box width="100px" height="25px" display={["block", "none"]}>
          <Logo />
        </Box>
        <Box width="100px" height="25px" display={["block", "none"]}>
          <Logo />
        </Box>
        <Box width="100px" height="25px" display={["block", "none"]}>
          <Logo />
        </Box>
      </HStack>
      {anySeeds && <Seeds />}
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
      <Copyright layout="static" />
      <Navbar />
    </>
  );
};

export default TuneView;
