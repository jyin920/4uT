import React, { useState } from 'react';
import { Target, CheckCircle2, Clock, Calculator, ArrowRight } from 'lucide-react';
import { MilestoneItem, VideoMetadata } from '../types';
import { formatNumber, formatJapaneseViews } from '../utils/formatters';

interface MilestoneTrackerProps {
  milestones: MilestoneItem[];
  metadata: VideoMetadata | null;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ milestones, metadata }) => {
  const [customTarget, setCustomTarget] = useState<number>(150000);

  const currentViews = metadata?.currentViews || 86621;
  const currentVelocity = metadata?.currentVelocity || 24800;

  // Custom Target Calculations
  const customRemaining = Math.max(0, customTarget - currentViews);
  const customHoursCurrentPace =
    currentVelocity > 0 ? (customRemaining / currentVelocity).toFixed(1) : '0';
  const customMinutesCurrentPace =
    currentVelocity > 0 ? Math.round((customRemaining / currentVelocity) * 60) : 0;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-lg shadow-black/20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-rose-500" />
            <h2 className="text-base font-bold text-white tracking-tight">目標マイルストーン達成予測</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            節目となる大台再生数への進捗率と現在のペースに基づく推定到達時刻
          </p>
        </div>
      </div>

      {/* Milestone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {milestones.map((milestone) => {
          const isReached = currentViews >= milestone.target;
          const remaining = Math.max(0, milestone.target - currentViews);
          const is1M = milestone.target === 1000000;

          return (
            <div
              key={milestone.target}
              className={`p-4 rounded-xl border transition-all ${
                is1M
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-950/20'
                  : isReached
                  ? 'bg-emerald-950/20 border-emerald-800/60'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold tracking-tight ${is1M ? 'text-amber-300' : 'text-white'}`}>
                  {milestone.label}
                </span>
                {isReached ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : is1M ? (
                  <Target className="w-4 h-4 text-amber-400" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-500" />
                )}
              </div>

              {/* Target view number */}
              <div className="mt-2 text-xs text-slate-400 font-mono">
                目標値: <span className="text-slate-200">{formatNumber(milestone.target)} 回</span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400 font-sans text-[11px]">進捗</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      isReached ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {milestone.progressPercent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isReached ? 'bg-emerald-500' : 'bg-gradient-to-r from-rose-600 to-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, milestone.progressPercent)}%` }}
                  />
                </div>
              </div>

              {/* ETA Details */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                {isReached ? (
                  <span className="text-emerald-400 font-medium">達成完了</span>
                ) : (
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>あと</span>
                      <strong className="text-white font-mono tabular-nums">
                        {formatNumber(remaining)} 回
                      </strong>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>予想到達:</span>
                      <span className="text-cyan-400 font-mono font-medium">
                        {milestone.etaMinutes
                          ? `${milestone.etaTimeJST} (${milestone.etaMinutes}分後)`
                          : milestone.etaHours
                          ? `約 ${milestone.etaHours} 時間後`
                          : '推計中'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Target Calculator Section */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">カスタム目標シミュレーター</h3>
          <span className="text-xs text-slate-400">（任意の目標再生数を設定して所要時間を計算）</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs text-slate-400 mb-1">目標再生数を入力 (回)</label>
            <input
              type="number"
              step={10000}
              min={currentViews}
              value={customTarget}
              onChange={(e) => setCustomTarget(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500 tabular-nums"
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">残り必要再生数</span>
              <span className="text-sm font-bold text-white font-mono tabular-nums">
                {formatNumber(customRemaining)} 回
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">現在の時速での到達</span>
              <span className="text-sm font-bold text-cyan-400 font-mono tabular-nums">
                {customMinutesCurrentPace < 60
                  ? `約 ${customMinutesCurrentPace} 分後`
                  : `約 ${customHoursCurrentPace} 時間後`}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block">目標の表現</span>
              <span className="text-sm font-semibold text-rose-400">
                {formatJapaneseViews(customTarget)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
