import React from "react";
import { Flex, Box, Text, Button, Checkbox } from "@chakra-ui/react";

import {
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

import useSWR from "swr";
import { Track, Artist, isSongLiked } from "./spotify";

import { useView, useSeeds, useRecommendations } from "./hooks";

type ItemProps = {
  item: Track | Artist;
  context?: "default" | "badge" | "search";
  onClick?: () => void;
};

const Item: React.FC<ItemProps> = ({
  onClick = undefined,
  context = "default",
  item,
}) => {
  const [_seeds, select] = useSeeds();
  const [view] = useView();
  const { trueSeeds } = useRecommendations();
  const { data: isLiked } = useSWR(
    `liked:${item.uri}`,
    async () => await isSongLiked(item.id)
  );

  const image = (item as Track)?.album?.images[2];
  const isSeed = context === "badge";
  const isSearch = context === "search";
  const isUsed = trueSeeds.has(item.uri);

  const handleClick = (e: React.MouseEvent) => {
    select(item)(e);
    if (typeof onClick === "function") onClick();
  };

  return (
    <Flex
      position="relative"
      width={isSeed ? undefined : "100%"}
      direction="row"
      opacity={isSeed && !isUsed ? 0.5 : 1}
      height={isSeed ? "100%" : "20vw"}
      maxHeight="100px"
      minHeight={isSeed ? "80px" : "80px"}
      data-item={JSON.stringify(item)}
    >
      {isSeed && isLiked && (
        <Box zIndex={1} position="absolute" right="0" top="0">
          <Box position="relative" left="-3px">
            <Text fontSize="14px" color="pint.500">
              ❤️
            </Text>
          </Box>
        </Box>
      )}
      <Button
        minWidth={isSeed || isSearch ? undefined : ["70vw", "auto"]}
        size={isSeed ? "xs" : "md"}
        onClick={handleClick}
        width="100%"
        height="100%"
        px={isSeed ? 1 : 2}
      >
        {!isSeed &&
          view === "tune" &&
          (isSearch ? <ChevronLeftIcon /> : <ChevronUpIcon />)}

        {image && (
          <Box
            flexShrink={0}
            minWidth={isSeed ? "25px" : "32px"}
            pl={isSeed ? 0 : "10px"}
            pr="4px"
          >
            <img src={image.url} width={isSeed ? "25px" : "32px"} />
          </Box>
        )}
        <Box flex={1}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box maxWidth="50vw">
              <Text
                fontSize={isSeed ? 14 : 16}
                color="gray.900"
                whiteSpace="normal"
                noOfLines={2}
              >
                {item.name}
              </Text>
            </Box>
            <Box maxWidth="30vw">
              <Text fontSize={isSeed ? 10 : 12} color="gray.600" isTruncated>
                {item.type === "artist"
                  ? " (artist)"
                  : ` ${(item as Track).artists[0].name}`}
              </Text>
            </Box>
          </Box>
        </Box>
        {!isSeed && (
          <Box
            flexGrow={0}
            flexShrink={0}
            minWidth="30px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {isLiked && <Text color="pint.500">❤️</Text>}
          </Box>
        )}
        {!isSeed && view !== "tune" && <ChevronRightIcon />}
      </Button>
    </Flex>
  );
};
export default Item;
