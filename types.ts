import * as React from 'react';
import { SpotifyThing } from './spotify';

export type Seeds = Set<string>;

export type View = 'search' | 'tune' | 'authorize';

export type SelectFunctionType = (
  item: SpotifyThing
) => (e: React.MouseEvent) => void;
