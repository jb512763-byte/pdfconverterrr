/** Device-only recent activity (file names & sizes only — files themselves never leave the device). */
export type HistoryItem = { name: string; size: number; tool: string; href: string; at: number };
const KEY = "ck-recent-v1";

export function readHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as HistoryItem[]; } catch { return []; }
}

export function addHistory(items: Omit<HistoryItem, "at">[]) {
  if (typeof window === "undefined" || !items.length) return;
  const now = Date.now();
  const next = [...items.map((i) => ({ ...i, at: now })), ...readHistory()].slice(0, 50);
  try { localStorage.setItem(KEY, JSON.stringify(next)); window.dispatchEvent(new Event("ck-history")); } catch { /* storage full/blocked */ }
}

export function clearHistory() {
  try { localStorage.removeItem(KEY); window.dispatchEvent(new Event("ck-history")); } catch { /* ignore */ }
}
