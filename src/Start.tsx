import React from 'react';
import {
  VStack, Box, Text, Flex,
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';
import { useCurrentTrack } from './hooks';

import DividerWithWord from './DividerWithWord';
import Item from './Item';

const StartView: React.FC = () => {
  const currentTrack = useCurrentTrack();

  return (
    <VStack spacing={0} flex={1} width="100vw">
      <Flex direction="column" flex={1} align="center" maxWidth="90vw">
        <Box p={5}>
          <SearchIcon width="40px" height="40px" />
        </Box>
        <Box>
          <Text fontSize="md" textAlign="center">
            Click the search for your first recommendation seed.
          </Text>
        </Box>
      </Flex>

      {currentTrack && (
        <>
          <Box flex={1} width="80%" maxWidth="550px">
            <DividerWithWord>Or</DividerWithWord>
          </Box>
          <Flex direction="column" align="center" flex={1}>
            <Box p={5}>
              <Text fontSize="40px">⏯</Text>
            </Box>
            <Text fontSize="md" textAlign="center" px={4}>
              You have a track playing.
              <br />
              Click it to use as 1st seed
            </Text>
          </Flex>
          <Flex justify="center" py={2} align="center" minHeight="30vh">
            <Box>👉</Box>
            <Item item={currentTrack} />
            <Box>👈</Box>
          </Flex>
        </>
      )}
    </VStack>
  );
};

export default StartView;
