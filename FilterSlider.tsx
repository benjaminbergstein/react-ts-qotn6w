import * as React from 'react';
import { RecommendFilter, RecommendFilters } from './spotify';

import { useSliders } from './hooks';

import {
  Box,
  Heading,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
} from '@chakra-ui/react';

import { sentenceCase } from 'change-case';

const FilterSlider: React.FC<{
  filter: RecommendFilter;
}> = ({ filter }) => {
  const [sliders, setSliders] = useSliders();

  return (
    <Box>
      <Heading size="s">
        {sentenceCase(filter)} - {sliders[filter] * 100}%
      </Heading>
      <Slider
        aria-label={`Slider for ${filter}`}
        defaultValue={sliders[filter] * 100}
        onChange={(val) =>
          setSliders((sliders) => ({ ...sliders, [filter]: val / 100 }))
        }
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
};

export default FilterSlider;
