import useSWR from "swr";

const VERSION = '1558635'
const key = (k) => `bb:${VERSION}:spotify:mixtape:${k}`;

export const fetch = (k, defaultValue = undefined) => {
  try {
    const v = JSON.parse(localStorage.getItem(key(k)));
    if (v !== null) return v;
    if (defaultValue === undefined) return defaultValue;
  } catch (e) {
    return store(k, defaultValue);
  }
};

export const store = (k, item) => {
  localStorage.setItem(key(k), JSON.stringify(item));
  return fetch(k);
};

export const remove = (k) => {
  localStorage.removeItem(key(k));
};

export function useLocalStorageItem<T>(k: string, defaultValue: T) {
  const fallbackData = fetch(k, defaultValue);
  const swrReturn = useSWR<T>(
    key(k),
    () => Promise.resolve(fetch(k, defaultValue)),
    { fallbackData }
  );

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
