import React, { CSSProperties, FC, useEffect, useRef, useState } from "react";
import {
  Divider,
  Box,
  Text,
  VStack,
  Flex,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  HStack,
  useTheme,
} from "@chakra-ui/react";

import { RepeatIcon } from "@chakra-ui/icons";
import { cacheGet } from "./spotify";

import { useSeeds } from "./hooks";

import Item from "./Item";
import { easings, animated, useSpring } from "react-spring";
import ClearButton from "./ClearButton";

const Seeds: FC = () => {
  const [seeds, _, __, ___, resetSeeds, countSeeds] = useSeeds();
  const [toggle, setToggle] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();

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

  useEffect(() => {
    setToggle(true);
  }, [countSeeds]);

  return (
    <Box>
      <Text color="gray.900" fontSize="xs" fontWeight={900} py={2}>
        Recommendation "Seeds"
      </Text>
      <Button
        as={animated.div}
        onClick={onOpen}
        width="100%"
        style={styles as unknown as CSSProperties}
      >
        {seeds.size} {seeds.size === 1 ? "seed" : "seeds"}
      </Button>
      <Drawer isOpen={isOpen} placement="top" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            {seeds.size} {seeds.size === 1 ? "seed" : "seeds"}
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
            <HStack spacing="10px" width="100%" justifyContent="space-between">
              <Box>
                <ClearButton closeParent={onClose} />
              </Box>
              <Button variant="outline" mr={3} onClick={onClose}>
                Close
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Divider />
    </Box>
  );
};

export default Seeds;
