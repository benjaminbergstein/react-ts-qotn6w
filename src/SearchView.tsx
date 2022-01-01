import React, { FC } from "react";
import { VStack } from "@chakra-ui/react";

import { useSearch } from "./hooks";

import SearchField from "./SearchField";
import Item from "./Item";

const SearchView: React.FC = () => {
  const results = useSearch();

  return (
    <>
      <VStack>
        <SearchField />

        {results?.tracks?.items &&
          results?.tracks?.items.map((track) => (
            <>
              <Item item={track} />
              <Item item={track.artists[0]} />
            </>
          ))}
      </VStack>
    </>
  );
};

export default SearchView;
