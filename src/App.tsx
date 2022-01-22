import React, { FC } from "react";
import { Box, Flex } from "@chakra-ui/react";

import { Helmet } from "react-helmet";
import { useView, useCaptureToken, useAuthorization } from "./hooks";

import AuthorizeView from "./AuthorizeView";
import TuneView from "./TuneView";
import LogOut from "./LogOut";

import { View } from "./types";

const ViewMap: Record<View, FC> = {
  authorize: AuthorizeView,
  tune: TuneView,
  logout: LogOut,
};

const App: FC = () => {
  const [view] = useView();

  useAuthorization();
  useCaptureToken();

  const CurrentView = ViewMap[view] || AuthorizeView;

  return (
    <>
      <Helmet>
        <title>Roam TUNES - Meander through new music</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <Flex direction="column" height="100vh">
        <CurrentView />
        <Box height="180px"> </Box>
      </Flex>
    </>
  );
};

export default App;
