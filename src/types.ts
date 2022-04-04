import * as React from "react";
import { SpotifyThing } from "./spotify";

export type Seeds = Set<string>;

export type View = "authorize" | "tune" | "logout" | "quiz" | "playlist";

export type SelectFunctionType = (
  item: SpotifyThing
) => (e?: React.MouseEvent | React.ChangeEvent) => void;

export type QuizQuestion =
  | "danceability"
  | "energy"
  | "tempo"
  | "popularity"
  | "valence"
  | "size";

export type QuestionType = {
  slug: QuizQuestion;
  title: string;
  labels?: [string, string, string];
};
