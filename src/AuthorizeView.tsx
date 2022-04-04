import React, { FC } from "react";
import { Heading, Text, Button, VStack, Flex } from "@chakra-ui/react";
import { ChevronRightIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { getAuthUrl } from "./spotify";
import Logo from "./Logo";
import Copyright from "./Copyright";
import { useMe, useView } from "./hooks";
import { useEffect } from "react";

const AuthorizeView: React.FC = () => {
  const me = useMe();
  const [_view, setView] = useView();
  const isAuthorized = !!me?.data?.id;

  return (
    <Flex
      p={3}
      flex={1}
      direction="row"
      align="center"
      width="100%"
      justify="center"
    >
      <VStack spacing="50px" align="center" maxWidth="350px">
        <Logo width="300px" height="72px" />

        <Heading
          color="gray.800"
          size="md"
          textAlign="center"
          lineHeight="150%"
        >
          The fastest way to discover dozens of tunes you'll{" "}
          <span title="love" aria-label="love">
            💓
          </span>
        </Heading>
        {!isAuthorized && (
          <a data-preload="false" href={getAuthUrl()}>
            <Button
              size="lg"
              rightIcon={<ExternalLinkIcon />}
              colorScheme="pink"
            >
              Connect Spotify
            </Button>
          </a>
        )}
        {isAuthorized && (
          <a href="/v/tune">
            <Button
              size="lg"
              rightIcon={<ChevronRightIcon />}
              colorScheme="pink"
            >
              Go to tuner
            </Button>
          </a>
        )}
      </VStack>
      <Copyright layout="fixed" />
    </Flex>
  );
};

export default AuthorizeView;
