import React, { FC, useRef } from "react";
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
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useQ, useSearch } from "./hooks";

import SearchField from "./SearchField";
import ItemSkeleton from "./ItemSkeleton";
import Item from "./Item";

const StartView: React.FC = () => {
  const [_q, setQ] = useQ();
  const { results, isValidating } = useSearch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleSelect = () => {
    onClose();
    setQ("");
  };

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
        placement="left"
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
                  results?.tracks?.items &&
                  results?.tracks?.items.map((track) => (
                    <>
                      <Item
                        onClick={handleSelect}
                        context="search"
                        item={track}
                      />
                      <Item
                        onClick={handleSelect}
                        context="search"
                        item={track.artists[0]}
                      />
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
