import React from 'react';
import { CheckCircle2, Sparkles, Trophy, Flag, Clock } from 'lucide-react';
import { VideoSnapshot } from '../types';
import { formatNumber } from '../utils/formatters';

interface SimpleMilestoneTimelineProps {
  currentViews: number;
  history: VideoSnapshot[];
}

interface MilestoneDef {
  target: number;
  label: string;
  defaultTime: string;
}

export const SimpleMilestoneTimeline: React.FC<SimpleMilestoneTimelineProps> = ({
  currentViews,
  history,
}) => {
  // Key milestone checkpoints
  const milestoneDefs: MilestoneDef[] = [
    { target: 10000, label: '1万回突破', defaultTime: '11/11 01:53' },
    { target: 30000, label: '3万回突破', defaultTime: '11/11 02:23' },
    { target: 50000, label: '5万回突破', defaultTime: '11/11 02:33' },
    { target: 100000, label: '10万回大台突破', defaultTime: '11/11 03:40' },
    { target: 250000, label: '25万回（クォーター）', defaultTime: '次のターゲット！' },
    { target: 500000, label: '50万回（ハーフミリオン）', defaultTime: '目標達成へ' },
    { target: 1000000, label: '100万回（★祝ミリオン）', defaultTime: '最終ゴール！' },
  ];

  // Helper to extract exact JST time from history
  const getReachedTime = (target: number, fallback: string) => {
    if (currentViews < target) return fallback;
    const match = history.find((h) => h.views >= target);
    if (match?.jstTime) {
      // e.g. "11/11 02:33:16 JST" -> "11/11 02:33"
      return match.jstTime.replace(/:\d{2} JST$/, '').replace(' JST', '');
    }
    return fallback;
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/20 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-white text-sm">
            再生数突破のあゆみ（進捗マイルストーン）
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">着実に前進中！</span>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {milestoneDefs.map((m) => {
          const isReached = currentViews >= m.target;
          const timeStr = getReachedTime(m.target, m.defaultTime);
          const remaining = Math.max(0, m.target - currentViews);
          const isCurrentTarget = !isReached && (m.target === 250000 || currentViews < m.target);

          return (
            <div key={m.target} className="relative flex items-center justify-between gap-3 text-xs">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center transition ${
                  isReached
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : isCurrentTarget
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20 animate-pulse'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isReached ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>

              {/* Milestone Info */}
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`font-bold ${
                    isReached
                      ? 'text-white'
                      : isCurrentTarget
                      ? 'text-amber-300 font-extrabold'
                      : 'text-slate-400'
                  }`}
                >
                  {m.label}
                </span>

                {isReached && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    達成済
                  </span>
                )}

                {isCurrentTarget && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold animate-pulse">
                    NEXT GOAL
                  </span>
                )}
              </div>

              {/* Time or Remaining Count */}
              <div className="font-mono text-[11px] shrink-0 text-right">
                {isReached ? (
                  <span className="text-emerald-400 font-medium">{timeStr} 達成</span>
                ) : (
                  <span className="text-slate-400">
                    あと <strong className="text-amber-400">{formatNumber(remaining)}</strong> 回
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
