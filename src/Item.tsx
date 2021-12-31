import React, { FC } from 'react';
import { Flex, Box, Text, Button, Checkbox } from '@chakra-ui/react';

import { ChevronUpIcon, ChevronRightIcon } from '@chakra-ui/icons';

import { Track, Artist } from './spotify';

import { useView, useSeeds } from './hooks';

type ItemProps = {
  item: Track | Artist;
};

const Item: React.FC<ItemProps> = ({ item }) => {
  const [seeds, select] = useSeeds();
  const [view] = useView();

  const isSeed = seeds.has(item.uri);

  return (
    <Flex direction="row" m={2}>
      <Button
        minWidth={isSeed ? undefined : '80vw'}
        size={isSeed ? 'xs' : 'md'}
        onClick={select(item)}
        width="100%"
      >
        {isSeed && (
          <Checkbox mr={2} onChange={select(item)} isChecked={isSeed} />
        )}
        {!isSeed && view === 'tune' && <ChevronUpIcon />}
        <Box flex={1}>
          <Box>
            <Text fontSize={16} color="gray.900">
              {item.name}
            </Text>
          </Box>
          <Box flex={1}>
            <Text fontSize={12} color="gray.600">
              {item.type === 'artist'
                ? ' (artist)'
                : ` ${(item as Track).artists[0].name}`}
            </Text>
          </Box>
        </Box>

        {!isSeed && view !== 'tune' && <ChevronRightIcon />}
      </Button>
    </Flex>
  );
};
export default Item;
