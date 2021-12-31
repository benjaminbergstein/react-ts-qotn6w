import React, { FC } from 'react';
import { HStack } from '@chakra-ui/react';

import { cacheGet, filters } from './spotify';

import { useSeeds, useRecommendations } from './hooks';

import FilterSlider from './FilterSlider';
import Item from './Item';

const TuneView: FC = () => {
  const [seeds] = useSeeds();
  const recommendations = useRecommendations();

  return <>
    <HStack spacing="2px">
      {Array.from(seeds)
        .map((uri) => cacheGet(uri))
        .map((item) => <Item item={item} />)}
    </HStack>
    {filters.map((filter) => (
      <FilterSlider filter={filter} />
    ))}
    {recommendations?.tracks &&
      recommendations?.tracks.map((item) => (
        <Item item={item} />
      ))}
  </>
};

export default TuneView;
