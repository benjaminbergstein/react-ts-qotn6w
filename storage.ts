import useSWR from 'swr';

const key = (k) => `bb:spotify:mixtape:${k}`;

export const fetch = (k) => JSON.parse(localStorage.getItem(key(k)));

export const store = (k, item) =>
  localStorage.setItem(key(k), JSON.stringify(item));

export function useLocalStorageItem<T>(k: string, defaultValue: T) {
  const swrReturn = useSWR<T>(key(k), () =>
    Promise.resolve(fetch(k) || defaultValue)
  );

  function set(item: T);
  function set(item: (old: T) => T);
  function set(item) {
    if (typeof item === 'function') {
      const current = fetch(k);
      set(item(current));
      return;
    }
    store(k, item);
    swrReturn.mutate(item);
  }

  return [swrReturn.data, set] as [T, typeof set];
}
