import React from 'react';
import { Heart, Sparkles, Flame, Users, CheckCircle2 } from 'lucide-react';

export const YourViewMattersBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-rose-950/60 via-slate-900 to-amber-950/40 border-2 border-rose-500/40 rounded-2xl p-4 sm:p-6 shadow-xl shadow-rose-950/20 space-y-3.5">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Headline */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-950/40 shrink-0">
          <Heart className="w-4 h-4 fill-white" />
        </div>
        <div>
          <span className="text-[10px] sm:text-xs font-bold text-rose-300 uppercase tracking-wider block">
            大切なお願い & メッセージ
          </span>
          <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
            あなたの「1再生・1参加」が、ふぉ〜ゆ〜を動かす決定打です！
          </h3>
        </div>
      </div>

      {/* Main Message Body */}
      <div className="relative z-10 space-y-2 text-xs sm:text-[13px] text-slate-200 leading-relaxed">
        <p>
          <strong className="text-amber-300 font-bold">「自分1人の再生なんて小さすぎて変わらないかも…」</strong>と思っていませんか？
          決してそんなことはありません！
        </p>
        <p className="text-slate-300">
          YouTubeのアルゴリズムは1人だけの大量連続ループを弾くため、100万回達成への唯一の道は<strong className="text-white font-bold">「1人でも多くの人が実際にフル尺で見てくれること」</strong>です。
          だからこそ、今日<span className="text-rose-300 font-bold underline decoration-rose-500 underline-offset-2">あなたが最後まで見てくれたその1回</span>が、何よりも価値のある本物の1票になります！
        </p>
      </div>

      {/* 3 Core Points of Impact */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] sm:text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-rose-500/30 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-bold">1回のフル尺完走</strong>
            <span className="text-slate-400 leading-tight">AIに「満足度の高い神動画」と認知させおすすめに推薦されます</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-start gap-2">
          <Users className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-bold">初見さんも大歓迎！</strong>
            <span className="text-slate-400 leading-tight">初めての方の1タップが、ミリオンへの最大の推進力になります</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-pink-500/30 flex items-start gap-2">
          <Flame className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-bold">1ポストの拡散力</strong>
            <span className="text-slate-400 leading-tight">あなたのSNSの1言が、まだ見ぬ新しいファンとの架け橋に！</span>
          </div>
        </div>
      </div>
    </div>
  );
};
