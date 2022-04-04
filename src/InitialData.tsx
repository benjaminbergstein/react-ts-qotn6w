import React from "react";
import { isServer, apiHost } from "./constants";

const InitialData = () => {
  if (!isServer) return null;
  const initialData = { apiHost };
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}`,
      }}
    />
  );
};

export default InitialData;
