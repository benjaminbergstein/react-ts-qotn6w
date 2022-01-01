import React, { FC } from "react";
import {
  Box,
  Text,
  Flex,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

import { useCurrentTrack } from "./hooks";

import SearchField from "./SearchField";
import DividerWithWord from "./DividerWithWord";
import Item from "./Item";
import Tooltip, { TooltipParagraph } from "./Tooltip";

const StartView: React.FC = () => {
  const currentTrack = useCurrentTrack();

  return (
    <>
      <Tooltip id="start:intro" label={`First "Seed"`}>
        <TooltipParagraph>
          We need a track or artist on which to base recommendations.
        </TooltipParagraph>
        {currentTrack && (
          <TooltipParagraph>
            You have something currently playing. Why not start with that?
          </TooltipParagraph>
        )}
      </Tooltip>
      {currentTrack && (
        <>
          <Box>
            <Item item={currentTrack} />
          </Box>

          <Flex justify="center" py={2}>
            <Box>☝️</Box>
            <Text px={4}>Now playing: click to use as first seed</Text>
            <Box>👆</Box>
          </Flex>

          <DividerWithWord>Or</DividerWithWord>
        </>
      )}

      <SearchField />
      <Tooltip id="start:search" label="Search for a seed">
        <TooltipParagraph>
          You can also search for a track below.
        </TooltipParagraph>
      </Tooltip>
    </>
  );
};

export default StartView;
