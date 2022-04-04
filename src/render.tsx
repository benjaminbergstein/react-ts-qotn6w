import React from "react";
import ReactDOMServer from "react-dom/server";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

import fs from "fs";

const sourceHtml = fs.readFileSync("build/index.html").toString();
fs.writeFileSync("build/template.html", sourceHtml);

const renderPage = (page, props) => {
  const baseHtml = fs.readFileSync("build/template.html").toString();
  const app = ReactDOMServer.renderToString(
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div id="root">
          <ChakraProvider>
            <App staticProps={props} />
          </ChakraProvider>
        </div>
      </body>
    </html>
  );

  fs.writeFileSync(
    `build/${page}.html`,
    baseHtml.replace('<div id="root"></div>', app)
  );
};

renderPage("playlist", { view: "playlist" });
renderPage("index", { view: "authorize" });
