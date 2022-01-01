import React, { FC } from "react";
import { Flex } from "@chakra-ui/react";

import { useView, useCaptureToken, useAuthorization } from "./hooks";

import NavBar from "./NavBar";
import LogOut from "./LogOut";
import SearchField from "./SearchField";
import DividerWithWord from "./DividerWithWord";

import SettingsView from "./SettingsView";
import SearchView from "./SearchView";
import StartView from "./StartView";
import AuthorizeView from "./AuthorizeView";
import TuneView from "./TuneView";

import { View } from "./types";

const ViewMap: Record<View, FC> = {
  settings: SettingsView,
  authorize: AuthorizeView,
  start: StartView,
  search: SearchView,
  tune: TuneView,
  logout: LogOut,
};

const App: FC = () => {
  const [view] = useView();

  useAuthorization();
  useCaptureToken();

  const CurrentView = ViewMap[view] || AuthorizeView;

  return (
    <Flex direction="column" height="100vh" p="10px">
      <NavBar />
      <CurrentView />
    </Flex>
  );
};

export default App;
