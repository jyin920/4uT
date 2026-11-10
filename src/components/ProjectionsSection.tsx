import React from 'react';
import { Compass, Sparkles, TrendingUp, Info } from 'lucide-react';
import { ProjectionScenario } from '../types';
import { formatNumber, formatJapaneseViews } from '../utils/formatters';

interface ProjectionsSectionProps {
  scenarios: ProjectionScenario[];
  currentViews: number;
}

export const ProjectionsSection: React.FC<ProjectionsSectionProps> = ({ scenarios, currentViews }) => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-lg shadow-black/20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-rose-500" />
            <h2 className="text-base font-bold text-white tracking-tight">今後の再生数推移シミュレーション</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            公開24時間（初日）・48時間・初週7日間のシナリオ別予測モデル
          </p>
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {scenarios.map((sc) => {
          return (
            <div
              key={sc.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{sc.name}</h3>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: sc.color }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{sc.description}</p>

                {/* Day 1 Forecast */}
                <div className="mt-5 p-3.5 bg-slate-950/80 rounded-lg border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">初日 24時間 予測:</span>
                    <div className="text-right">
                      <span className="text-base font-bold text-white font-mono tabular-nums">
                        {formatNumber(sc.day1Views)}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">回</span>
                      <div className="text-[11px] text-rose-400 font-medium">
                        ({formatJapaneseViews(sc.day1Views)})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                    <span className="text-slate-400">48時間 予測:</span>
                    <span className="text-slate-200 font-mono font-medium tabular-nums">
                      {formatJapaneseViews(sc.day2Views)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                    <span className="text-slate-400">初週 7日間 累計:</span>
                    <span className="text-emerald-400 font-mono font-bold tabular-nums">
                      {formatJapaneseViews(sc.day7Views)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress comparison against current */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                <span>初日予測に対する現在比:</span>
                <span className="text-slate-200 font-mono font-semibold tabular-nums">
                  {((currentViews / sc.day1Views) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytical Context Callout */}
      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 block mb-1">初動推移分析と加速ファクター</strong>
          本作『BLOOM WORLD』は、結成15周年を迎えた「ふぉ〜ゆ〜」初のCDデビュー曲（堂本光一氏プロデュース / 堂島孝平氏作詞）として、公開直後よりSNS上でファンおよびアイドル愛好家による強力な拡散が観測されています。また「東京ジョイポリス30周年記念コラボ」との連動企画も進行しており、夕方から夜間のコアタイムにかけてさらなる再生数の急伸が予測されます。
        </div>
      </div>
    </div>
  );
};
