import React from "react";
import { arrayOf } from "./utils";

const Filler = ({ n, children }) => (
  <>
    {arrayOf(n).map(() => (
      <>{children}</>
    ))}
  </>
);

export default Filler;
