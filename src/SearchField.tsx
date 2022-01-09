import React, { FC } from "react";
import {
  Box,
  Button,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
} from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";
import { useView, useQ } from "./hooks";

const SearchField: FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [q, setQ] = useQ();
  const [view, setView] = useView();

  const performSearch = async () => {
    const newQ = inputRef.current.value;
    // setView("search");
    setQ(newQ);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <>
      <Box height="100px"></Box>
      <Box
        zIndex={1}
        p={3}
        backgroundColor="white"
        position="fixed"
        bottom="0"
        width="100vw"
        height="100px"
      >
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              defaultValue={q}
              ref={inputRef}
              type="search"
              placeholder="Search"
            />

            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" type="submit">
                <SearchIcon />
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
      </Box>
    </>
  );
};

export default SearchField;
