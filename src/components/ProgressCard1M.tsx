import React from 'react';
import { Trophy, Target, Flag, Clock, Flame, Rocket } from 'lucide-react';
import { VideoMetadata, Roadmap1MData } from '../types';
import { formatNumber } from '../utils/formatters';

interface ProgressCard1MProps {
  metadata: VideoMetadata | null;
  roadmap: Roadmap1MData | null;
}

export const ProgressCard1M: React.FC<ProgressCard1MProps> = ({ metadata, roadmap }) => {
  const currentViews = metadata?.currentViews || 98603;
  const targetViews = 1000000;
  const remainingViews = Math.max(0, targetViews - currentViews);
  const percent = Number(((currentViews / targetViews) * 100).toFixed(2));
  
  const velocity = metadata?.currentVelocity || roadmap?.organicPacePerHour || 18200;
  const activeVelocity = Math.max(1000, velocity);

  // Realistic hours needed
  const hoursStandard = Math.round((remainingViews / activeVelocity) * 10) / 10;
  const boostVelocity = Math.round(activeVelocity * 1.35);
  const hoursFast = Math.round((remainingViews / boostVelocity) * 10) / 10;

  // Format date helper (JST)
  const formatTargetDate = (hoursFromNow: number) => {
    const d = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const dayName = days[d.getDay()];
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${month}/${date}(${dayName}) ${hours}:${mins} 頃`;
  };

  const standardTargetDateStr = formatTargetDate(hoursStandard);
  const fastTargetDateStr = formatTargetDate(hoursFast);
  const savedHours = Math.max(1, Math.round(hoursStandard - hoursFast));

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/20 space-y-4">
      {/* Title & Speed */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-white text-sm">
            100万回再生 (ミリオン) 進捗状況
          </h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-slate-300 text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>時速: <strong className="text-amber-400">{formatNumber(velocity)}回/h</strong></span>
        </div>
      </div>

      {/* 4 Numbers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[11px] text-slate-400 font-medium block">現在再生数</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1 tabular-nums">
            {formatNumber(currentViews)}
            <span className="text-[10px] text-slate-400 font-sans ml-0.5">回</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[11px] text-slate-400 font-medium block">達成率</span>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono mt-1 tabular-nums">
            {percent}%
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[11px] text-slate-400 font-medium block">ミリオンまであと</span>
          <div className="text-xl sm:text-2xl font-black text-pink-300 font-mono mt-1 tabular-nums">
            {formatNumber(remainingViews)}
            <span className="text-[10px] text-slate-400 font-sans ml-0.5">回</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-3">
          <span className="text-[11px] text-amber-300 font-semibold block flex items-center gap-1">
            <Rocket className="w-3 h-3 text-amber-400" /> 目指せる達成時間
          </span>
          <div className="text-sm sm:text-base font-bold text-amber-300 font-mono mt-1 tabular-nums">
            {standardTargetDateStr}
          </div>
          <span className="text-[10px] text-slate-400">（あと約 {hoursStandard} 時間）</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="relative w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 transition-all duration-700 relative"
            style={{ width: `${Math.max(2, Math.min(100, percent))}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
          <span>0 回</span>
          <span className="text-amber-300 font-bold">目標: 1,000,000 回</span>
        </div>
      </div>

      {/* Realistic Target Time & Acceleration Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-bold">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              今のペースをキープ
            </span>
            <span className="font-mono text-slate-400 text-[11px]">約{formatNumber(activeVelocity)}回/h</span>
          </div>
          <div className="text-base font-bold text-white font-mono">
            {standardTargetDateStr}
          </div>
          <p className="text-[11px] text-slate-400">今の勢いを維持すれば十分に到達可能な目標です！</p>
        </div>

        <div className="p-3 rounded-xl bg-gradient-to-br from-rose-950/30 to-amber-950/20 border border-amber-500/30 text-xs space-y-1">
          <div className="flex items-center justify-between text-amber-300 font-bold">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              みんなで加速（最速狙い）
            </span>
            <span className="font-mono text-emerald-400 text-[11px]">約{savedHours}時間前倒し！</span>
          </div>
          <div className="text-base font-bold text-amber-300 font-mono">
            {fastTargetDateStr}
          </div>
          <p className="text-[11px] text-slate-300">SNSでの呼びかけや一斉視聴でさらに記録を縮められます！</p>
        </div>
      </div>
    </div>
  );
};
