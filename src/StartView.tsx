import React, { FC } from 'react';
import {
  Box,
  Text,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

import { useCurrentTrack } from './hooks';

import SearchField from './SearchField';
import DividerWithWord from './DividerWithWord'
import Item from './Item'

const StartView: React.FC = () => {
  const currentTrack = useCurrentTrack();

  return <>
    <Alert status="success">
      <AlertIcon />
      <AlertDescription>
        Let's get started! First, we need a song or artist to seed...
      </AlertDescription>
    </Alert>
    <Divider m={2} />
    {currentTrack && (
      <>
        <Box>
          <Text>You have something currently playing:</Text>
        </Box>
        <Item item={currentTrack} />

        <Box align="center">
          <Text>
            ☝️ &nbsp;&nbsp;Click it to use it as your first
            seed.&nbsp;&nbsp;👆
          </Text>
        </Box>

        <DividerWithWord>Or</DividerWithWord>
      </>
    )}

    <SearchField />
  </>
};

export default StartView;
