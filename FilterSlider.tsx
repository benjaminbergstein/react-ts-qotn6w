import * as React from 'react';
import { RecommendFilter, filterScales } from './spotify';

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

  const scale = filterScales[filter] || 1;
  return (
    <Box>
      <Heading size="s">
        {sentenceCase(filter)} - {(sliders[filter] / 100) * scale}%
      </Heading>
      <Slider
        aria-label={`Slider for ${filter}`}
        defaultValue={sliders[filter]}
        onChange={(val) =>
          setSliders((sliders) => ({ ...sliders, [filter]: val }))
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
