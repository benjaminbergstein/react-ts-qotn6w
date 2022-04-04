import React, { CSSProperties, FC, useEffect, useRef, useState } from "react";
import { loader } from "graphql.macro";
import graphql from "./graphql";
import {
  Box,
  Text,
  VStack,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  ButtonGroup,
  Input,
  InputGroup,
  InputLeftAddon,
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import { capitalCase } from "change-case";
import words from "./words.json";
import {
  CheckIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  RepeatIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import {
  cacheGet,
  createPlaylist,
  addItemsToPlaylist,
  SpotifyThing,
  queueAdd,
} from "./spotify";

import { useMe, useRender, useSeeds, useSetting } from "./hooks";

import Item from "./Item";
import { easings, animated, useSpring } from "react-spring";
import ClearButton from "./ClearButton";
import {
  CreatePlaylistInput,
  CreatePlaylistMutation,
  CreatePlaylistMutationVariables,
} from "./generated/graphql";

const randomWord = () => {
  const n = Math.floor(Math.random() * words.length);
  return capitalCase(words[n % words.length]);
};

const CreatePlaylist = loader("./CreatePlaylist.graphql");

const getPlaylistName = () => randomWord() + " " + randomWord();

const Seeds: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [seeds, _, __, ___, resetSeeds, countSeeds] = useSeeds();
  const { data: me } = useMe();
  const [toggle, setToggle] = useState<boolean>(false);
  const [sendToStep, setSendToStep] = useState<number>(0);
  const [isOpen, setSeedsDrawerOpen] = useSetting("drawerOpen", false);
  const [error, setError] = useState<string | undefined>(undefined);
  const onOpen = () => {
    setSeedsDrawerOpen(true);
  };
  const cancelRef = useRef();
  const onClose = () => {
    setSeedsDrawerOpen(false);
  };

  const [playlistName, setPlaylistName] = useState<string>(getPlaylistName());
  const styles = useSpring({
    config: {
      clamp: true,
      velocity: 1000,
      duration: toggle ? 50 : 300,
      easing: easings.easeInBounce,
    },
    onRest: () => {
      setTimeout(() => {
        setToggle(() => false);
      }, 50);
    },
    transform: toggle ? "scale(1.15)" : "scale(1.01)",
    boxShadow: toggle
      ? "0px 0px 5px 0 rgb(0 0 0 / 15%)"
      : "0px 0px 0px 0px transparent",
  });

  const createPlaylistFromSeeds = async () => {
    const userPlaylistName = inputRef.current.value;
    const res = await createPlaylist(me?.id, userPlaylistName);
    await addItemsToPlaylist(res?.id, Array.from(seeds).join(","));
    await graphql<CreatePlaylistMutation, CreatePlaylistMutationVariables>({
      query: CreatePlaylist,
      variables: {
        title: userPlaylistName,
        spotifyPlaylistId: res?.id,
        tracks: Array.from(seeds),
      },
    });
    setSendToStep(3);
    setTimeout(() => {
      setSendToStep(0);
    }, 3000);
  };

  const addToQueue = async () => {
    try {
      await Promise.all(Array.from(seeds).map((uri) => queueAdd(uri)));
      setSendToStep(0);
      setTimeout(() => {
        setSendToStep(0);
      }, 3000);
    } catch (e) {
      setError(
        "You currently do not have an active player. Start playing mustic to add to queue."
      );
    }
  };

  useEffect(() => {
    setToggle(true);
  }, [countSeeds]);

  return (
    <>
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
        <Text
          color="gray.900"
          fontSize="xs"
          fontWeight={900}
          py={2}
          textColor="pink.500"
          textShadow="1px 1px 0 var(--chakra-colors-pink-100), 1px 2px 0 var(--chakra-colors-pink-500)"
        >
          Your playlist
        </Text>
        <Button
          as={animated.div}
          onClick={onOpen}
          width="100%"
          style={styles as unknown as CSSProperties}
        >
          {seeds.size} {seeds.size === 1 ? "track" : "tracks"}
        </Button>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            {seeds.size} {seeds.size === 1 ? "track" : "tracks"} picked
          </DrawerHeader>
          <DrawerBody>
            <VStack
              display="flex"
              spacing="10px"
              minHeight="min-content"
              direction="row-reverse"
              align="center"
            >
              {Array.from(seeds)
                .map((uri) => cacheGet(uri))
                .map((item) => (
                  <Item item={item} />
                ))}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Box display="flex" overflow="hidden">
              <Box
                width="100%"
                flexShrink={0}
                transform={`translateX(${sendToStep * -100}%)`}
                transition="transform 0.25s"
                display="flex"
                alignItems="center"
              >
                <ButtonGroup isAttached>
                  <ClearButton isIcon closeParent={onClose} />
                  <Button
                    size="sm"
                    rightIcon={<ExternalLinkIcon />}
                    variant="outline"
                    colorScheme="pink"
                    onClick={() => {
                      setSendToStep(1);
                    }}
                  >
                    Send to
                  </Button>
                  <Button
                    size="sm"
                    rightIcon={<ChevronRightIcon />}
                    variant="outline"
                    onClick={onClose}
                  >
                    Tune
                  </Button>
                </ButtonGroup>
              </Box>
              <Box
                width="100%"
                flexShrink={0}
                transform={`translateX(${sendToStep * -100}%)`}
                transition="transform 0.25s"
                display="flex"
                alignItems="center"
              >
                <ButtonGroup isAttached width="100%">
                  <Button
                    flex={1}
                    size="sm"
                    variant="solid"
                    colorScheme="pink"
                    onClick={() => {
                      setSendToStep(2);
                    }}
                  >
                    Playlist
                  </Button>
                  <Button
                    flex={1}
                    size="sm"
                    variant="outline"
                    onClick={addToQueue}
                    colorScheme="pink"
                  >
                    Queue
                  </Button>
                </ButtonGroup>
              </Box>
              <Box
                width="100%"
                flexShrink={0}
                transform={`translateX(${sendToStep * -100}%)`}
                transition="transform 0.25s"
              >
                <InputGroup size="sm" variant="outline">
                  <InputLeftAddon
                    as="button"
                    onClick={() => {
                      setPlaylistName(getPlaylistName());
                    }}
                    children={<RepeatIcon />}
                  />
                  <Input
                    ref={inputRef}
                    key={playlistName}
                    defaultValue={playlistName}
                  />
                </InputGroup>
                <ButtonGroup
                  size="sm"
                  mt={3}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSendToStep(0);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    iconRight={<ChevronRightIcon />}
                    onClick={createPlaylistFromSeeds}
                    colorScheme="pink"
                  >
                    Create
                  </Button>
                </ButtonGroup>
              </Box>
              <Box
                width="100%"
                flexShrink={0}
                transform={`translateX(${sendToStep * -100}%)`}
                transition="transform 0.25s"
              >
                <HStack spacing="20px">
                  <CheckIcon color="green.500" />
                  <Box>Playlist created!</Box>
                </HStack>
              </Box>
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={!!error}
        onClose={() => {
          setError(undefined);
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box py={5}>
                <WarningTwoIcon width="75px" height="75px" color="orange.400" />
              </Box>
              <Box>Something went wrong</Box>
            </AlertDialogHeader>

            <AlertDialogBody>{error}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={() => {
                  setError(undefined);
                }}
              >
                Okay
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Seeds;
