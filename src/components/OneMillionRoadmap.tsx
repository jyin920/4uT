import React, { useState } from 'react';
import { Trophy, Clock, Zap, Calendar, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { Roadmap1MData } from '../types';
import { formatNumber, formatJapaneseViews } from '../utils/formatters';

interface OneMillionRoadmapProps {
  roadmap: Roadmap1MData | null;
}

export const OneMillionRoadmap: React.FC<OneMillionRoadmapProps> = ({ roadmap }) => {
  const [customPace, setCustomPace] = useState<number>(roadmap?.organicPacePerHour || 18000);

  if (!roadmap) return null;

  const remaining = roadmap.remainingViews;
  const customHoursTo1M = customPace > 0 ? (remaining / customPace).toFixed(1) : '0';
  const customEtaDate = new Date(Date.now() + Number(customHoursTo1M) * 3600 * 1000);
  const customEtaStr = `${customEtaDate.getMonth() + 1}/${customEtaDate.getDate()} ${String(
    customEtaDate.getHours()
  ).padStart(2, '0')}:${String(customEtaDate.getMinutes()).padStart(2, '0')} JST`;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 sm:p-6 lg:p-7 shadow-xl shadow-black/30 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              目標 1,000,000回再生 (1ミリオン突破) ロードマップ
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            プレミア公開初期のタイムラグ・急伸バーストを除外した実態推移傾向に基づく100万再生到達予測
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 shrink-0">
          <span className="text-slate-400">実力ベース時速:</span>
          <span className="text-amber-400 font-bold tabular-nums">約 {formatNumber(roadmap.organicPacePerHour)} 回/h</span>
        </div>
      </div>

      {/* Main 1M Progress Hero Box */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 rounded-xl border border-amber-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Big progress stats */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ミリオン達成進捗状況
              </span>
              <span className="font-mono text-slate-300">
                目標: <strong className="text-white">1,000,000 回</strong> (100万回)
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight tabular-nums">
                {formatNumber(roadmap.currentViews)}
              </span>
              <span className="text-sm font-medium text-slate-400 font-mono">/ 1,000,000 回</span>
              <span className="text-xl sm:text-2xl font-bold text-amber-400 font-mono tabular-nums ml-auto">
                {roadmap.progressPercent}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-600 via-amber-500 to-yellow-400 transition-all duration-700 shadow-md shadow-amber-500/30"
                style={{ width: `${Math.max(2, Math.min(100, roadmap.progressPercent))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
              <span>公開から {formatJapaneseViews(roadmap.currentViews)} 突破</span>
              <span className="text-slate-200">
                100万まであと <strong className="text-amber-400 font-semibold">{formatNumber(roadmap.remainingViews)}</strong> 回
              </span>
            </div>
          </div>

          {/* Right: Primary ETA Banner */}
          <div className="lg:w-80 shrink-0 p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>有力シナリオ到達予測 (標準)</span>
            </div>

            <div className="text-xl font-bold text-amber-300 font-mono tracking-tight">
              {roadmap.standardEtaJST}
            </div>

            <div className="text-xs text-slate-400 leading-relaxed">
              公開後 <strong className="text-white font-mono">約 {roadmap.standardEtaHours} 時間</strong>（デビュー3日目夕方〜夜間）に100万回再生到達が最も有力な軌跡です。
            </div>
          </div>
        </div>
      </div>

      {/* 3 Scenarios Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scenario 1: Viral */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-rose-500/50 transition-colors">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-rose-400">最速バイラルシナリオ</span>
            <span className="font-mono text-slate-400">約 {roadmap.viralEtaHours} 時間</span>
          </div>
          <div className="text-base font-bold text-white font-mono">{roadmap.viralEtaJST}</div>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            Xトレンド1位継続や関連アーティスト言及、急上昇上位キープで加速した場合（デビュー2日目夜達成）
          </p>
        </div>

        {/* Scenario 2: Standard (Promising) */}
        <div className="p-4 bg-amber-950/20 border border-amber-500/40 rounded-xl">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-amber-300">標準維持シナリオ [有力]</span>
            <span className="font-mono text-slate-400">約 {roadmap.standardEtaHours} 時間</span>
          </div>
          <div className="text-base font-bold text-white font-mono">{roadmap.standardEtaJST}</div>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            朝夕のリスナー流入とファンによるリピート再生が定着した場合の現実的モデル（デビュー3日目夕方達成）
          </p>
        </div>

        {/* Scenario 3: Conservative */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-300">定常・慎重シナリオ</span>
            <span className="font-mono text-slate-400">約 {roadmap.conservativeEtaHours} 時間</span>
          </div>
          <div className="text-base font-bold text-white font-mono">{roadmap.conservativeEtaJST}</div>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            初動バースト後の深夜減速から定常ペースへ落ち着いた場合の保守的モデル（デビュー4〜5日目達成）
          </p>
        </div>
      </div>

      {/* Target Pace Requirements (ペースメーカー) */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">100万再生達成のための必要ペース（ペースメーカー）</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400">3日以内 (11/14まで) 達成</div>
            <div className="text-lg font-bold text-white font-mono tabular-nums mt-1">
              +{formatNumber(roadmap.requiredPace3Days)} <span className="text-xs text-slate-400">回/h</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">現在実力値（~2.2万/h）で十分到達圏</div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400">5日以内 (11/16まで) 達成</div>
            <div className="text-lg font-bold text-white font-mono tabular-nums mt-1">
              +{formatNumber(roadmap.requiredPace5Days)} <span className="text-xs text-slate-400">回/h</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">日中定常ペースで達成可能</div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400">初週7日以内 (11/18まで) 達成</div>
            <div className="text-lg font-bold text-white font-mono tabular-nums mt-1">
              +{formatNumber(roadmap.requiredPace7Days)} <span className="text-xs text-slate-400">回/h</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">最低維持ライン</div>
          </div>
        </div>
      </div>

      {/* Interactive Custom Pace Simulator */}
      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white">ペース調整シミュレーター</h3>
            <p className="text-xs text-slate-400">想定する平均時速スライダーを動かして100万達成日時を逆算</p>
          </div>
          <div className="text-xs font-mono text-amber-400 font-bold bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            平均時速: +{formatNumber(customPace)} 回/h
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min={5000}
            max={40000}
            step={1000}
            value={customPace}
            onChange={(e) => setCustomPace(Number(e.target.value))}
            aria-label="想定平均時速スライダー"
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>5,000回/h (緩やか)</span>
            <span>20,000回/h (現在水準)</span>
            <span>40,000回/h (超急拡大)</span>
          </div>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400">シミュレーション到達時間:</span>
            <strong className="text-white font-mono ml-1.5 tabular-nums">約 {customHoursTo1M} 時間後</strong>
          </div>
          <div>
            <span className="text-slate-400">予想到達日時:</span>
            <strong className="text-amber-400 font-mono ml-1.5">{customEtaStr}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
