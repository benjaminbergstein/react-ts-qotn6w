export const isServer = typeof window === "undefined";

export const httpHost = isServer
  ? process.env.HOST || `${process.env.CF_PAGES_BRANCH}.roam-tunes.pages.dev`
  : window?.document?.location?.host;
export const httpProtocol = isServer
  ? process.env.PROTOCOL
  : window?.document?.location?.protocol;
