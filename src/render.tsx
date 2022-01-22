import React from "react";
import ReactDOMServer from "react-dom/server";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

import fs from "fs";
const app = ReactDOMServer.renderToString(
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
      <div id="root">
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </div>
    </body>
  </html>
);

const html = fs.readFileSync("build/index.html").toString();
fs.writeFileSync(
  "build/index.html",
  html.replace('<div id="root"></div>', app)
);
