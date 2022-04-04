export const isServer = typeof window === "undefined";

const isomorphicConstant = (server, client) => {
  return (isServer ? server : client)();
};

const initialData = (key, initialCB, defaultCB) => {
  if (isServer) return initialCB();
  const allData = (window as any)?.__INITIAL_DATA__;
  const data = allData?.[key];
  if (data) return data;
  return defaultCB();
};
const gitBranch = process.env.CF_PAGES_BRANCH;

export const httpHost = isomorphicConstant(
  () => process.env.HOST || `${gitBranch}.roam-tunes.pages.dev`,
  () => window?.document?.location?.host
);

export const httpProtocol = isomorphicConstant(
  () => process.env.PROTOCOL,
  () => window?.document?.location?.protocol
);

export const apiHost = initialData(
  "apiHost",
  () => {
    if (process.env.API_HOST) return process.env.API_HOST;
    if (gitBranch) return `${gitBranch}.react-ts-qotn6w.pages.dev`;
    return "localhost:8788";
  },
  () => "localhost:8788"
);
