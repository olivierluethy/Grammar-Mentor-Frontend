"use client";

import { useEffect, useMemo, useState } from "react";
import { X, TrendingDown, TrendingUp, Minus, Trash2, Printer } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  mistakeHistory,
  type MistakeRecord,
  type MistakeStats,
} from "@/lib/mistake-history";
import { openPracticeSheet, type PracticeItem } from "@/lib/practice-pdf";

interface MistakeHistoryModalProps {
  open: boolean;
  onClose: () => void;
  onGeneratePractice?: (count: number) => void;
}

function formatDay(date: string): string {
  // date is YYYY-MM-DD
  const d = new Date(date + "T00:00:00");
  try {
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return date.slice(5);
  }
}

function buildPracticeItems(records: MistakeRecord[], limit = 25): PracticeItem[] {
  const seen = new Set<string>();
  const items: PracticeItem[] = [];
  // Walk newest-first so the sheet targets the most recent struggles.
  for (let i = records.length - 1; i >= 0 && items.length < limit; i--) {
    const r = records[i];
    const key = `${r.original}→${r.correction}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({
      original: r.original,
      correction: r.correction,
      explanation: r.explanation,
      ruleName: r.ruleName,
    });
  }
  return items;
}

export default function MistakeHistoryModal({
  open,
  onClose,
  onGeneratePractice,
}: MistakeHistoryModalProps): React.JSX.Element | null {
  const [records, setRecords] = useState<MistakeRecord[]>([]);
  const [stats, setStats] = useState<MistakeStats>(() =>
    mistakeHistory.getStats(),
  );

  // Load + subscribe while the modal is open so it reflects new checks live.
  useEffect(() => {
    if (!open) return;
    const refresh = () => {
      setRecords(mistakeHistory.getAll());
      setStats(mistakeHistory.getStats());
    };
    refresh();
    const unsubscribe = mistakeHistory.subscribe(refresh);
    return unsubscribe;
  }, [open]);

  const chartData = useMemo(
    () =>
      stats.byDay.map((d) => ({
        date: d.date,
        label: formatDay(d.date),
        count: d.count,
      })),
    [stats.byDay],
  );

  const topRules = useMemo(() => stats.byRule.slice(0, 6), [stats.byRule]);
  const maxRuleCount = topRules.length > 0 ? topRules[0].count : 0;

  const trend = useMemo(() => {
    const { last7Days, previous7Days } = stats;
    if (previous7Days === 0 && last7Days === 0)
      return { dir: "flat" as const, pct: 0 };
    if (previous7Days === 0) return { dir: "up" as const, pct: 100 };
    const delta = ((last7Days - previous7Days) / previous7Days) * 100;
    if (Math.abs(delta) < 1) return { dir: "flat" as const, pct: 0 };
    return {
      dir: delta < 0 ? ("down" as const) : ("up" as const),
      pct: Math.round(Math.abs(delta)),
    };
  }, [stats]);

  if (!open) return null;

  const hasHistory = stats.total > 0;

  const handleClearHistory = (): void => {
    if (
      confirm(
        "Clear your entire mistake history? This permanently deletes all tracked mistakes from this browser and cannot be undone.",
      )
    ) {
      mistakeHistory.clear();
    }
  };

  const handleGeneratePractice = (): void => {
    const items = buildPracticeItems(records);
    if (items.length === 0) return;
    const opened = openPracticeSheet(items);
    if (opened) onGeneratePractice?.(items.length);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[1500] flex items-end sm:items-center justify-center p-0 sm:p-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-950 border border-slate-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-[760px] max-h-[90vh] overflow-y-auto shadow-[0_25px_50px_rgba(0,0,0,0.5)] animate-[modalSlideIn_0.3s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-950 z-10">
          <div>
            <h2 className="font-['Crimson_Pro',serif] text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
              📈 Mistake History
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Track your progress and the errors you make most
            </p>
          </div>
          <button
            className="bg-transparent border-none text-2xl text-slate-400 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-slate-800 hover:text-white flex-shrink-0"
            onClick={onClose}
            aria-label="Close history"
          >
            <X size={22} />
          </button>
        </div>

        {!hasHistory ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="text-4xl sm:text-5xl mb-4">🌱</div>
            <p className="text-white font-semibold text-base sm:text-lg mb-2">
              No mistakes tracked yet
            </p>
            <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
              Run a grammar check and every issue found will be recorded here so
              you can watch your writing improve over time.
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-6">
            {/* Summary tiles */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-5 sm:mb-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {stats.total}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide mt-1">
                  Total mistakes
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {stats.daysActive}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide mt-1">
                  {stats.daysActive === 1 ? "Day" : "Days"} practised
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 text-center">
                <div
                  className={`text-2xl sm:text-3xl font-bold flex items-center justify-center gap-1 ${
                    trend.dir === "down"
                      ? "text-emerald-400"
                      : trend.dir === "up"
                        ? "text-amber-400"
                        : "text-slate-300"
                  }`}
                >
                  {trend.dir === "down" ? (
                    <TrendingDown size={22} />
                  ) : trend.dir === "up" ? (
                    <TrendingUp size={22} />
                  ) : (
                    <Minus size={22} />
                  )}
                  {trend.pct > 0 ? `${trend.pct}%` : "—"}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide mt-1">
                  vs. prev. 7 days
                </div>
              </div>
            </div>

            {/* Trend chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 mb-5 sm:mb-6">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-3">
                Mistakes over time
              </h3>
              <div className="h-[180px] sm:h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 6, right: 8, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="mistakeGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                        <stop
                          offset="100%"
                          stopColor="#6366f1"
                          stopOpacity={0.03}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1e293b"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: "#1e293b" }}
                      minTickGap={16}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      width={32}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "#94a3b8" }}
                      cursor={{ stroke: "#6366f1", strokeWidth: 1 }}
                      formatter={(value: number) => [`${value}`, "Mistakes"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#818cf8"
                      strokeWidth={2}
                      fill="url(#mistakeGradient)"
                      dot={false}
                      activeDot={{ r: 4, fill: "#818cf8" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Most common errors */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 mb-5 sm:mb-6">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-3">
                Your most common errors
              </h3>
              <div className="space-y-2.5">
                {topRules.map((rule) => (
                  <div key={rule.key}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-200 text-xs sm:text-sm truncate pr-2">
                        {rule.key}
                      </span>
                      <span className="text-slate-400 text-xs sm:text-sm font-semibold flex-shrink-0">
                        {rule.count}×
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            maxRuleCount > 0
                              ? Math.max(6, (rule.count / maxRuleCount) * 100)
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleGeneratePractice}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
              >
                <Printer size={18} />
                Generate Practice Sheet
              </button>
              <button
                onClick={handleClearHistory}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-slate-800 text-slate-300 hover:bg-red-500/10 hover:text-red-400 border border-slate-700 hover:border-red-500/40 transition-all duration-200"
              >
                <Trash2 size={16} />
                Clear history
              </button>
            </div>
            <p className="text-center text-[10px] sm:text-xs text-slate-600 mt-3">
              History is stored only in this browser — nothing is uploaded.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
