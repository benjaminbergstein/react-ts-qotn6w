import React, { FC } from "react";
import { Heading, Text, Button, VStack, Flex } from "@chakra-ui/react";

import { getAuthUrl } from "./spotify";

const AuthorizeView: React.FC = () => (
  <Flex flex={1} direction="row" align="center" width="100%" justify="center">
    <VStack spacing="30px" align="right" maxWidth="600px">
      <Heading size="lg">Meander through new music woohooo</Heading>
      <Heading size="md">Add spontaneity to your queue and playlists.</Heading>
      <Text fontSize="sm">
        Zero in on what you're looking for by tweaking dimensions such as energy
        / danceability / popularity).
      </Text>
      <a href={getAuthUrl()}>
        <Button>Authorize Spotify</Button>
      </a>
    </VStack>
  </Flex>
);

export default AuthorizeView;
