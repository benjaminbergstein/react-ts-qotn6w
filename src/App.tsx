import React, { FC, Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import InitialData from "./InitialData";

import { Spinner, Flex } from "@chakra-ui/react";
import { isServer } from "./constants";

import { Helmet } from "react-helmet";
import { useView, useCaptureToken, useAuthorization, useRouter } from "./hooks";

import AuthorizeView from "./AuthorizeView";
import QuizView from "./QuizView";
import ManagePlaylistView from "./ManagePlaylistView";

if (!isServer) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
  }
}

const TuneView = React.lazy(() => import("./TuneView"));
// const PlaylistView = React.lazy(() => import("./PlaylistView"));
import PlaylistView from "./PlaylistView";

import LogOut from "./LogOut";

import { View } from "./types";

const ViewMap: Record<View, FC> = {
  authorize: AuthorizeView,
  tune: TuneView,
  quiz: QuizView,
  playlist: PlaylistView,
  managePlaylist: ManagePlaylistView,
  logout: LogOut,
};

type AppProps = {
  staticProps?: any;
};

const foo = async () => {
  await fetch("/foobar");
};

if (!isServer) {
  foo();
}

const closestAnchor = (element) => {
  if (element.tagName === "A") return element;
  if (!element.parentNode) return false;
  return closestAnchor(element.parentNode);
};
const App: FC<AppProps> = ({ staticProps = undefined }) => {
  const [view] = useView(staticProps?.view as View);
  const [tick, setTick] = useState<number>(+new Date());

  const render = () => setTick(+new Date());

  useEffect(() => {
    const listener = async (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      const link = closestAnchor(target);
      if (!link) return;
      const href = link.href;
      if (link.dataset.preload === "false") return;
      if (!href) return;
      e.preventDefault();
      history.pushState({}, "yes", "/" + href.split("/").slice(3).join("/"));
      render();
    };
    document.addEventListener("click", listener, false);
    return () => {
      document.removeEventListener("click", listener, false);
    };
  }, []);

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
      <InitialData />
    </>
  );
};

export default App;
