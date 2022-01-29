import React, { FC, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Spinner, Box, Flex, Text } from "@chakra-ui/react";
import { isServer } from "./constants";

import { Helmet } from "react-helmet";
import { useView, useCaptureToken, useAuthorization } from "./hooks";

import AuthorizeView from "./AuthorizeView";
import QuizView from "./QuizView";

const TuneView = React.lazy(() => import("./TuneView"));

import LogOut from "./LogOut";

import { View } from "./types";

const ViewMap: Record<View, FC> = {
  authorize: AuthorizeView,
  tune: TuneView,
  quiz: QuizView,
  logout: LogOut,
};

const App: FC = () => {
  const [view, setView] = useView();

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
        {!isServer && (
          <Suspense
            fallback={() => (
              <Flex height="100vh" alignItems="center">
                <Spinner />
              </Flex>
            )}
          >
            <ErrorBoundary FallbackComponent={AuthorizeView}>
              <CurrentView />
            </ErrorBoundary>
          </Suspense>
        )}
        {isServer && <CurrentView />}
      </Flex>
    </>
  );
};

export default App;
