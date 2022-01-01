import * as React from "react";
import { RecommendFilter, filterScales, defaultFilters } from "./spotify";

import { useSliders } from "./hooks";

import {
  Text,
  Box,
  Heading,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
} from "@chakra-ui/react";

import { sentenceCase } from "change-case";

const getF = (filter) => {
  const letters = filter.split("");
  const minOrMax = letters.slice(0, 3).join("");
  const oppositeMinOrMax = minOrMax === "min" ? "max" : "min";
  const dimension = letters.slice(3).join("");
  return [minOrMax === "min", dimension, `${oppositeMinOrMax}${dimension}`];
};

const FilterSlider: React.FC<{
  filter: RecommendFilter;
}> = ({ filter }) => {
  const [sliders, setSliders] = useSliders();
  const [isMin, dimension, otherDimension] = getF(filter);

  const scale = filterScales[filter] || 1;

  const handleChange = (val) => {
    const currentFilters = { ...defaultFilters, ...sliders };
    const otherVal = currentFilters[otherDimension];
    const adjustments = {};

    if (isMin && otherVal < val) {
      currentFilters[otherDimension] = val > 80 ? 100 : val + 20;
    }
    if (!isMin && otherVal > val) {
      currentFilters[otherDimension] = val < 20 ? 0 : val - 20;
    }
    setSliders((sliders) => ({ ...currentFilters, [filter]: val }));
  };

  return (
    <Box width="100%">
      <Text color="gray.600" fontSize="14px" textTransform="uppercase">
        {sentenceCase(filter)} - {(sliders[filter] / 100) * scale}/{scale}
      </Text>
      <Box p={2}>
        <Slider
          aria-label={`Slider for ${filter}`}
          value={sliders[filter]}
          onChange={handleChange}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
    </Box>
  );
};

export default FilterSlider;
