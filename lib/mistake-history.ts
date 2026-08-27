// ========================================
// MISTAKE HISTORY
// ----------------------------------------
// Local-only progress tracking for the grammar tool. Every mistake the
// checker surfaces is recorded to localStorage so the learner can see how
// often they make certain errors and whether they improve over time.
//
// This repo is the frontend and has no user database of its own, so — in
// line with the existing snippet / session / daily-usage storage — history
// lives entirely in the browser. Nothing is sent anywhere and the learner
// can wipe it at any time (see `clear`).
// ========================================

const STORAGE_KEY = "grammar_mentor_mistake_history";
// Keep storage bounded so long-term use never bloats localStorage.
const MAX_RECORDS = 1000;

export interface MistakeInput {
  original: string;
  correction: string;
  explanation?: string;
  rule_name?: string;
  type?: string;
}

export interface MistakeRecord {
  id: string;
  timestamp: number;
  date: string; // YYYY-MM-DD, for day-level grouping
  ruleName: string;
  type: string;
  original: string;
  correction: string;
  explanation: string;
  language: string;
}

export interface CategoryCount {
  key: string;
  count: number;
}

export interface DayCount {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface MistakeStats {
  total: number;
  daysActive: number;
  firstDate: string | null;
  lastDate: string | null;
  byRule: CategoryCount[]; // sorted, most frequent first
  byType: CategoryCount[]; // sorted, most frequent first
  byDay: DayCount[]; // chronological, gap-filled between first and last day
  last7Days: number;
  previous7Days: number;
}

function toLocalDateKey(timestamp: number): string {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function makeId(timestamp: number, index: number): string {
  return `${timestamp}-${index}-${Math.floor(Math.random() * 1e6)}`;
}

class MistakeHistoryManagerClass {
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  getAll(): MistakeRecord[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as MistakeRecord[];
    } catch (e) {
      console.error("Failed to parse mistake history:", e);
      return [];
    }
  }

  private save(records: MistakeRecord[]): void {
    if (typeof window === "undefined") return;
    try {
      // Keep only the most recent MAX_RECORDS entries.
      const trimmed =
        records.length > MAX_RECORDS
          ? records.slice(records.length - MAX_RECORDS)
          : records;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.error("Failed to save mistake history:", e);
    }
  }

  /**
   * Record a batch of mistakes surfaced by a single grammar check.
   * Returns the number of records added.
   */
  record(mistakes: MistakeInput[], language: string): number {
    if (typeof window === "undefined") return 0;
    if (!mistakes || mistakes.length === 0) return 0;

    const now = Date.now();
    const date = toLocalDateKey(now);
    const lang = (language || "auto").toLowerCase();

    const newRecords: MistakeRecord[] = mistakes
      .filter((m) => m && m.original && m.correction)
      .map((m, index) => ({
        id: makeId(now, index),
        timestamp: now,
        date,
        ruleName: (m.rule_name || "Other").trim() || "Other",
        type: (m.type || "grammar").trim() || "grammar",
        original: m.original,
        correction: m.correction,
        explanation: m.explanation || "",
        language: lang,
      }));

    if (newRecords.length === 0) return 0;

    const existing = this.getAll();
    this.save([...existing, ...newRecords]);
    this.notifyListeners();
    return newRecords.length;
  }

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear mistake history:", e);
    }
    this.notifyListeners();
  }

  getStats(): MistakeStats {
    const records = this.getAll();
    const empty: MistakeStats = {
      total: 0,
      daysActive: 0,
      firstDate: null,
      lastDate: null,
      byRule: [],
      byType: [],
      byDay: [],
      last7Days: 0,
      previous7Days: 0,
    };
    if (records.length === 0) return empty;

    const ruleMap = new Map<string, number>();
    const typeMap = new Map<string, number>();
    const dayMap = new Map<string, number>();

    for (const r of records) {
      ruleMap.set(r.ruleName, (ruleMap.get(r.ruleName) || 0) + 1);
      typeMap.set(r.type, (typeMap.get(r.type) || 0) + 1);
      dayMap.set(r.date, (dayMap.get(r.date) || 0) + 1);
    }

    const sortDesc = (map: Map<string, number>): CategoryCount[] =>
      Array.from(map.entries())
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count);

    const sortedDays = Array.from(dayMap.keys()).sort();
    const firstDate = sortedDays[0];
    const lastDate = sortedDays[sortedDays.length - 1];

    // Fill day gaps so a trend line reads correctly between active days.
    const byDay: DayCount[] = [];
    const cursor = new Date(firstDate + "T00:00:00");
    const end = new Date(lastDate + "T00:00:00");
    // Cap the rendered span to a year to keep the chart light.
    let guard = 0;
    while (cursor <= end && guard < 366) {
      const key = toLocalDateKey(cursor.getTime());
      byDay.push({ date: key, count: dayMap.get(key) || 0 });
      cursor.setDate(cursor.getDate() + 1);
      guard++;
    }

    // Rolling 7-day comparison for a simple "are you improving?" signal.
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    let last7 = 0;
    let prev7 = 0;
    for (const r of records) {
      const age = now - r.timestamp;
      if (age < 7 * day) last7++;
      else if (age < 14 * day) prev7++;
    }

    return {
      total: records.length,
      daysActive: dayMap.size,
      firstDate,
      lastDate,
      byRule: sortDesc(ruleMap),
      byType: sortDesc(typeMap),
      byDay,
      last7Days: last7,
      previous7Days: prev7,
    };
  }
}

export const mistakeHistory = new MistakeHistoryManagerClass();
