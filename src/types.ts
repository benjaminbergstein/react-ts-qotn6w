import * as React from "react";
import { SpotifyThing } from "./spotify";

export type Seeds = Set<string>;

export type View =
  | "authorize"
  | "tune"
  | "logout"
  | "quiz"
  | "playlist"
  | "managePlaylist";

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

export type QuizSelections = Record<QuizQuestion, QuizAnswer>;
export type QuizAnswer = "low" | "high";
export type QuestionType = Record<QuizAnswer, string> & {
  slug: QuizQuestion;
  toPlaylistName:
    | Record<Exclude<QuizAnswer, "low">, string>
    | Record<Exclude<QuizAnswer, "high">, string>
    | Record<QuizAnswer, string>;
};

export type ManagedPlaylistMetadata = {
  quizAnswers: Record<QuizQuestion, QuizAnswer>;
  desiredSize: number;
  included: string[];
  removed: string[];
};

export type ManagedPlaylist = {
  spotifyId: string;
  name?: string;
  id: string;
  metadata: ManagedPlaylistMetadata;
};
