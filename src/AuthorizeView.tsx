import React, { FC } from "react";
import { Heading, Text, Button, VStack, Flex } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { getAuthUrl } from "./spotify";
import Logo from "./Logo";
import Copyright from "./Copyright";

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
      <Logo width="300px" height="72px" />

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
        <Button rightIcon={<ExternalLinkIcon />} colorScheme="pink">
          Connect Spotify
        </Button>
      </a>
    </VStack>
    <Copyright layout="fixed" />
  </Flex>
);

export default AuthorizeView;
