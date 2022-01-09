import * as React from "react";
import { SpotifyThing } from "./spotify";

export type Seeds = Set<string>;

export type View = "authorize" | "tune" | "logout";

export type SelectFunctionType = (
  item: SpotifyThing
) => (e?: React.MouseEvent | React.ChangeEvent) => void;
