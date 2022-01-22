import useSWR from "swr";

const VERSION = "1558635";
const key = (k) => `bb:${VERSION}:spotify:mixtape:${k}`;
import { isServer } from "./constants";

export const fetch = (k, defaultValue = undefined) => {
  try {
    const v = JSON.parse(localStorage.getItem(key(k)));
    if (v !== null) return v;
    if (defaultValue === undefined) return defaultValue;
  } catch (e) {
    return store(k, defaultValue);
  }
  return store(k, defaultValue);
};

export const store = (k, item) => {
  localStorage.setItem(key(k), JSON.stringify(item));
  return fetch(k);
};

export const remove = (k) => {
  localStorage.removeItem(key(k));
};

export function useLocalStorageItem<T>(k: string, defaultValue: T) {
  const fallbackData = isServer ? defaultValue : fetch(k, defaultValue);
  const swrReturn = useSWR<T>(
    key(k),
    () => Promise.resolve(fetch(k, defaultValue)),
    { fallbackData }
  );

  if (isServer) {
    return [defaultValue, () => {}, () => {}] as [
      T,
      (_n: T | ((old: T) => T)) => void,
      () => void
    ];
  }

  function set(item: T);
  function set(item: (old: T) => T);
  function set(item) {
    if (typeof item === "function") {
      const current = fetch(k);
      set(item(current));
      return;
    }
    store(k, item);
    swrReturn.mutate(item);
  }

  const clear = () => {
    remove(k);
    swrReturn.mutate();
  };

  return [swrReturn.data || defaultValue, set, clear] as [
    T,
    typeof set,
    typeof clear
  ];
}
