import React, { FC, useRef } from 'react';
import {
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerBody,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerFooter,
  VStack,
  Box,
  Text,
  Flex,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useCurrentTrack, useSearch } from './hooks';

import SearchField from './SearchField';
import DividerWithWord from './DividerWithWord';
import Item from './Item';

const StartView: React.FC = () => {
  const currentTrack = useCurrentTrack();

  const results = useSearch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        flex="1"
        variant="outline"
        py={3}
        ref={btnRef}
        colorScheme="teal"
        onClick={onOpen}
      >
        <SearchIcon />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search</DrawerHeader>

          <DrawerBody>
            <>
              <VStack>
                {results?.tracks?.items
                  && results?.tracks?.items.map((track) => (
                    <>
                      <Item context="search" item={track} />
                      <Item context="search" item={track.artists[0]} />
                    </>
                  ))}
              </VStack>
            </>
          </DrawerBody>

          <DrawerFooter>
            <SearchField />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default StartView;
