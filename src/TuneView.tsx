import React, { FC } from 'react';
import {
  Box, Text, VStack, Spinner,
} from '@chakra-ui/react';

import { useBerzerkMode, useSeeds, useRecommendations } from './hooks';

import Navbar from './Navbar';
import Seeds from './Seeds';
import Item from './Item';
import Start from './Start';

const TuneView: FC = () => {
  const [seeds] = useSeeds();
  const { recommendations, isValidating } = useRecommendations();

  useBerzerkMode();

  const anySeeds = seeds.size !== 0;

  return (
    <>
      <Box bg="gray.50" p={3} mb={5} boxShadow="md">
        <Navbar />
        {anySeeds && <Seeds />}
      </Box>
      {anySeeds && isValidating && (
        <VStack
          my="25px"
          spacing="25px"
          borderWidth="1px"
          borderRadius={4}
          p={4}
        >
          <Spinner color="gray.600" />
          <Text fontSize="sm" color="gray.600">
            Updating recs...
          </Text>
        </VStack>
      )}
      {anySeeds && !isValidating && recommendations?.tracks && (
        <VStack alignItems="start" p={3}>
          <Text color="gray.900" fontSize="xs" fontWeight={900} py={2}>
            Recommendations
          </Text>
          {recommendations?.tracks.map((item) => (
            <Item item={item} />
          ))}
        </VStack>
      )}
      {!anySeeds && <Start />}
    </>
  );
};

export default TuneView;
