import React from "react";
import { VStack, Button, Box, Text, Flex } from "@chakra-ui/react";

import { useCurrentTrack, useView } from "./hooks";
import SearchDrawer from "./SearchDrawer";

import DividerWithWord from "./DividerWithWord";
import Item from "./Item";

const StartView: React.FC = () => {
  const currentTrack = useCurrentTrack();
  const [_view, setView] = useView();

  return (
    <VStack
      spacing={3}
      flex={1}
      width="100vw"
      padding={3}
      maxWidth="600px"
      justify="center"
      margin="0 auto"
    >
      <Box>
        <Text fontSize="sm" textAlign="center">
          Let's find you some unfamiliar music.
        </Text>
      </Box>
      <Box width="100%">
        <a href="/v1/quiz">
          <Button width="100%" minHeight="200px" whiteSpace="break-spaces">
            Answer a few questions to generate a playlist.
          </Button>
        </a>
      </Box>
      <Box width="100%">
        <SearchDrawer context="start" closeParent={() => {}} />
      </Box>
      {false && (
        <>
          <Box py={5}>
            <SearchDrawer context="start" closeParent={() => {}} />
          </Box>

          <Box>
            <Text fontSize="md" textAlign="center">
              Search for your first recommendation seed.
            </Text>
          </Box>

          {currentTrack && (
            <>
              <Box width="80%" maxWidth="550px">
                <DividerWithWord>Or</DividerWithWord>
              </Box>
              <Box>
                <Flex direction="column" align="center" flex={1}>
                  <Text fontSize="md" textAlign="center" px={4}>
                    Start from your current playing track:
                  </Text>
                </Flex>
                <Flex pt={10} justify="center" align="center">
                  <Box mr={3}>👉</Box>
                  <Item item={currentTrack} />
                  <Box ml={3}>👈</Box>
                </Flex>
              </Box>
            </>
          )}
        </>
      )}
    </VStack>
  );
};

export default StartView;
