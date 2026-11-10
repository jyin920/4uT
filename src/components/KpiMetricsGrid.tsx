import React from 'react';
import { Eye, Zap, Heart, MessageSquare, Target, CheckCircle2 } from 'lucide-react';
import { VideoMetadata, MilestoneItem } from '../types';
import { formatNumber, formatJapaneseViews } from '../utils/formatters';

interface KpiMetricsGridProps {
  metadata: VideoMetadata | null;
  milestones: MilestoneItem[];
}

export const KpiMetricsGrid: React.FC<KpiMetricsGridProps> = ({ metadata, milestones }) => {
  if (!metadata) return null;

  const nextMilestone = milestones.find((m) => !m.isReached) || milestones[milestones.length - 1];
  const remainingViews = nextMilestone ? Math.max(0, nextMilestone.target - metadata.currentViews) : 0;
  const is100kReached = metadata.currentViews >= 100000;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* KPI 1: Total Views */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium text-slate-300">総再生回数 (YouTube実績)</span>
            <Eye className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight tabular-nums">
              {formatNumber(metadata.currentViews)}
            </span>
            <span className="text-xs text-slate-400">回</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-rose-400 font-medium">{formatJapaneseViews(metadata.currentViews)}</span>
          <span className="text-slate-400 font-mono text-[11px]">リアルタイム実測値</span>
        </div>
      </div>

      {/* KPI 2: Velocity / Pace */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium text-slate-300">直近確定時速 (1時間推移)</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight tabular-nums">
              +{formatNumber(metadata.currentVelocity)}
            </span>
            <span className="text-xs text-slate-400">回/h</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-amber-400 font-mono font-medium text-[11px] tabular-nums">
            巡航ペース: 約2.1万〜2.4万/h
          </span>
          <span className="text-slate-500 text-[10px] title='YouTubeバッチ反映時の瞬間最大値'">
            バッチ最大 +11.4万/h
          </span>
        </div>
      </div>

      {/* KPI 3: Likes & Ratio */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium text-slate-300">高評価数 / 率 (実測)</span>
            <Heart className="w-4 h-4 text-pink-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight tabular-nums">
              {formatNumber(metadata.currentLikes)}
            </span>
            <span className="text-xs text-pink-400 font-mono font-medium">({metadata.likeRatio}%)</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-pink-400 font-medium text-[11px]">高評価率 {metadata.likeRatio}%</span>
          <span className="text-slate-400 text-[11px]">極めて高水準</span>
        </div>
      </div>

      {/* KPI 4: Exact Comments from YouTube */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium text-slate-300">総コメント数 (YouTube直接取得)</span>
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight tabular-nums">
              {formatNumber(metadata.currentComments)}
            </span>
            <span className="text-xs text-cyan-400 font-mono font-medium">({metadata.commentRatio}%)</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-cyan-400 font-medium text-[11px]">コメント率 {metadata.commentRatio}%</span>
          <span className="text-slate-400 text-[11px]">公式確定値</span>
        </div>
      </div>

      {/* KPI 5: Next Milestone Progress */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium text-slate-300">
              {is100kReached ? '次目標: 25万再生' : '目標: 10万再生'}
            </span>
            {is100kReached ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Target className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight tabular-nums">
              {nextMilestone?.progressPercent}%
            </span>
            <span className="text-xs text-slate-400">{is100kReached ? '進行中' : '達成'}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-300 font-mono text-[11px] tabular-nums">
            あと {formatNumber(remainingViews)} 回
          </span>
          <span className="text-emerald-400 font-mono text-[11px]">
            {is100kReached ? '本日昼〜夕刻予測' : '目前'}
          </span>
        </div>
      </div>
    </div>
  );
};
