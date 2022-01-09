import React, { FC } from "react";
import { Divider, Box, Text, Stack, Flex, Button } from "@chakra-ui/react";

import { RepeatIcon } from "@chakra-ui/icons";
import { cacheGet } from "./spotify";

import { useSeeds } from "./hooks";

import Item from "./Item";

const Seeds: FC = () => {
  const [seeds, _, __, ___, resetSeeds] = useSeeds();

  return (
    <Box>
      <Text color="gray.900" fontSize="xs" fontWeight={900} py={2}>
        Recommendation "Seeds"
      </Text>
      {seeds.size > 0 && (
        <Flex overflowX="scroll" flex={1}>
          <Stack
            display="flex"
            spacing="2px"
            minHeight="min-content"
            direction="row-reverse"
            align="center"
          >
            {Array.from(seeds)
              .map((uri) => cacheGet(uri))
              .map((item) => (
                <Item item={item} context="badge" />
              ))}
            <Button
              height="100%"
              mr="10px"
              size="xs"
              colorScheme="red"
              variant="ghost"
              onClick={resetSeeds}
              leftIcon={<RepeatIcon height="14px" width="14px" />}
            >
              clear
            </Button>
          </Stack>
        </Flex>
      )}
      <Divider />
    </Box>
  );
};

export default Seeds;
