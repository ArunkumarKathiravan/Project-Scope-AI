import type { HistoryItem, SavedItem } from "@/types";
const HISTORY = "projectscope:history";
const SAVED = "projectscope:saved";
function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}
function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable in private or restricted browser contexts.
  }
}
export const historyStorage = {
  list: () => read<HistoryItem>(HISTORY),
  add: (item: HistoryItem) =>
    write(
      HISTORY,
      [item, ...read<HistoryItem>(HISTORY).filter((x) => x.id !== item.id)].slice(0, 30)
    ),
  clear: () => write<HistoryItem>(HISTORY, [])
};
export const savedStorage = {
  list: () => read<SavedItem>(SAVED),
  add: (item: SavedItem) =>
    write(SAVED, [item, ...read<SavedItem>(SAVED).filter((x) => x.id !== item.id)]),
  updateNote: (id: string, note: string) =>
    write(
      SAVED,
      read<SavedItem>(SAVED).map((x) => (x.id === id ? { ...x, note } : x))
    ),
  remove: (id: string) =>
    write(
      SAVED,
      read<SavedItem>(SAVED).filter((x) => x.id !== id)
    ),
  clear: () => write<SavedItem>(SAVED, [])
};
export function exportStorage() {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      history: historyStorage.list(),
      saved: savedStorage.list()
    },
    null,
    2
  );
}
export function importStorage(raw: string) {
  const data = JSON.parse(raw) as { history?: HistoryItem[]; saved?: SavedItem[] };
  if (!Array.isArray(data.history) || !Array.isArray(data.saved))
    throw new Error("Invalid ProjectScope export.");
  write(HISTORY, data.history);
  write(SAVED, data.saved);
}
