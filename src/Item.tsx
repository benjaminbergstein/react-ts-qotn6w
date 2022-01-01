import React, { FC } from "react";
import { Flex, Box, Text, Button, Checkbox } from "@chakra-ui/react";

import { ChevronUpIcon, ChevronRightIcon } from "@chakra-ui/icons";

import { Track, Artist } from "./spotify";

import { useView, useSeeds, useRecommendations } from "./hooks";

type ItemProps = {
  item: Track | Artist;
  context?: "default" | "badge";
};

const Item: React.FC<ItemProps> = ({ context = "default", item }) => {
  const [seeds, select] = useSeeds();
  const [view] = useView();
  const { trueSeeds } = useRecommendations();

  const image = (item as Track)?.album?.images[2];
  const isSeed = context === "badge";
  console.log({ trueSeeds });
  const isUsed = trueSeeds.has(item.uri);

  return (
    <Flex
      width={isSeed ? undefined : "100%"}
      direction="row"
      opacity={isSeed && !isUsed ? 0.5 : 1}
      height={isSeed ? "100%" : "20vw"}
      maxHeight="100px"
      minHeight={isSeed ? "50px" : "80px"}
    >
      <Button
        minWidth={isSeed ? undefined : "70vw"}
        size={isSeed ? "xs" : "md"}
        onClick={select(item)}
        width="100%"
        height="100%"
      >
        {!isSeed && view === "tune" && <ChevronUpIcon />}

        {image && (
          <Box
            flexShrink={0}
            px="10px"
            py="3px"
            minWidth={isSeed ? "25px" : "32px"}
          >
            <img src={image.url} width={isSeed ? "25px" : "32px"} />
          </Box>
        )}
        <Box flex={1}>
          <Box>
            <Box maxWidth={isSeed ? "20vw" : "60vw"}>
              <Text fontSize={16} color="gray.900" isTruncated>
                {item.name}
              </Text>
            </Box>
          </Box>
          <Box flex={1}>
            <Box maxWidth={isSeed ? "20vw" : "60vw"}>
              <Text fontSize={12} color="gray.600" isTruncated>
                {item.type === "artist"
                  ? " (artist)"
                  : ` ${(item as Track).artists[0].name}`}
              </Text>
            </Box>
          </Box>
        </Box>

        {!isSeed && view !== "tune" && <ChevronRightIcon />}
      </Button>
    </Flex>
  );
};
export default Item;
