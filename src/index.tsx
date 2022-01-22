import React from "react";
import { hydrate } from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

hydrate(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  document.getElementById("root")
);
