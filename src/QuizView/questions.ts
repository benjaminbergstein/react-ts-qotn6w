import { QuestionType } from "../types";

export const questions: QuestionType[] = [
  {
    slug: "danceability",
    low: "Less dancy",
    high: "Super dancy",
    toPlaylistName: { high: "dancy" },
  },
  {
    slug: "energy",
    low: "Low energy",
    high: "High energy",
    toPlaylistName: { low: "chill", high: "energetic" },
  },
  {
    slug: "tempo",
    low: "Lower tempo",
    high: "Fast tempo",
    toPlaylistName: { high: "high tempo" },
  },
  {
    slug: "valence",
    low: "Somber feeling",
    high: "Positive feeling",
    toPlaylistName: { low: "somber", high: "positive vibes" },
  },
  {
    slug: "popularity",
    low: "Not too popular",
    high: "Popular",
    toPlaylistName: { low: "indie", high: "popular" },
  },
];

export const answerMap = {
  low: [0, 54],
  high: [55, 100],
};
