import React, { FC } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";

import { useCurrentTrack } from "./hooks";

import SearchField from "./SearchField";
import DividerWithWord from "./DividerWithWord";
import Item from "./Item";

const StartView: React.FC = () => {
  const currentTrack = useCurrentTrack();

  return (
    <Box padding={5}>
      {currentTrack && (
        <>
          <Box>
            <Item item={currentTrack} />
          </Box>

          <Flex justify="center" py={2}>
            <Box>☝️</Box>
            <Text px={4}>Now playing: click to use as first seed</Text>
            <Box>👆</Box>
          </Flex>

          <DividerWithWord>Or</DividerWithWord>
        </>
      )}

      <SearchField />
    </Box>
  );
};

export default StartView;
