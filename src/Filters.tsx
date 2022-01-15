import React, { FC } from "react";
import { Button } from "@chakra-ui/react";
import { HamburgerIcon, RepeatIcon } from "@chakra-ui/icons";
import { defaultFilters, filters } from "./spotify";

import Drawer from "./Drawer";
import { useSliders } from "./hooks";

import FilterSlider from "./FilterSlider";

const Controls: FC = () => {
  const [_, __, clearSliders] = useSliders();
  return (
    <Button
      mr={3}
      onClick={() => {
        clearSliders();
      }}
      variant="outline"
      colorScheme="red"
      leftIcon={<RepeatIcon />}
    >
      Clear filters
    </Button>
  );
};

const Filters: FC = () => {
  const [clearSliders] = useSliders();

  return (
    <Drawer
      placement="right"
      toggle={<HamburgerIcon />}
      title="Filters"
      controls={Controls}
    >
      {filters.map((filter) => (
        <FilterSlider filter={filter} />
      ))}
    </Drawer>
  );
};

export default Filters;
