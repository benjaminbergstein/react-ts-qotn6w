import React, { FC } from "react";
import { Heading, Text, Button, VStack, Flex } from "@chakra-ui/react";

import { getAuthUrl } from "./spotify";

const AuthorizeView: React.FC = () => (
  <Flex
    p={3}
    flex={1}
    direction="row"
    align="center"
    width="100%"
    justify="center"
  >
    <VStack spacing="30px" align="right" maxWidth="600px">
      <Heading color="pink.600" size="sm" style={{ fontVariant: "small-caps" }}>
        <em>SpotifyTuner&trade;</em>
      </Heading>
      <Heading color="gray.800" size="lg">
        Meander through new music
      </Heading>
      <Heading color="gray.600" size="md">
        Add spontaneity to your queue and playlists.
      </Heading>
      <Text color="gray.800" fontSize="sm">
        Zero in on what you're looking for by tweaking dimensions such as energy
        / danceability / popularity).
      </Text>
      <a href={getAuthUrl()}>
        <Button colorScheme="pink">Authorize Spotify</Button>
      </a>
    </VStack>
  </Flex>
);

export default AuthorizeView;
