const KEY = 'cct.streak';

export function loadStreak(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { date?: string; count?: number };
    return parsed.date === today ? parsed.count ?? 0 : 0;
  } catch {
    return 0;
  }
}

export function saveStreak(count: number): void {
  if (typeof window === 'undefined') return;
  try {
    const today = new Date().toISOString().slice(0, 10);
    window.localStorage.setItem(KEY, JSON.stringify({ date: today, count }));
  } catch {
    /* ignore */
  }
}
