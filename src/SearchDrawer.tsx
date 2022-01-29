import React, { FC, useRef } from "react";
import {
  Button,
  useDisclosure,
  IconButton,
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

type Props = {
  closeParent: () => void;
  context?: "navbar" | "start";
};

const StartView: React.FC<Props> = ({ context = "navbar", closeParent }) => {
  const [_q, setQ] = useQ();
  const { results, isValidating } = useSearch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  const isStart = context === "start";
  const handleSelect = () => {
    closeParent();
    onClose();
    setQ("");
  };

  return (
    <>
      {isStart && (
        <Button
          onClick={onOpen}
          width="100%"
          minHeight="200px"
          whiteSpace="break-spaces"
        >
          Search for a song and then tweak filters
        </Button>
      )}
      {!isStart && (
        <Button
          flex="1"
          variant="outline"
          py={4}
          ref={btnRef}
          colorScheme="teal"
          onClick={onOpen}
          width="100%"
          leftIcon={<SearchIcon />}
        >
          Search
        </Button>
      )}
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
