import React, { FC } from "react";
import {
  Button,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
} from "@chakra-ui/react";

import { useView, useQ } from "./hooks";

const SearchField: FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [q, setQ] = useQ();
  const [view, setView] = useView();

  const performSearch = async () => {
    const newQ = inputRef.current.value;
    setView("search");
    setQ(newQ);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children="
    🔎"
        />
        <Input
          defaultValue={q}
          ref={inputRef}
          type="search"
          placeholder="Search"
        />

        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" type="submit">
            🔎
          </Button>
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default SearchField;
