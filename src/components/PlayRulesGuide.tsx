import React from 'react';
import { Volume2, RefreshCcw, Eye, Flame, Compass, Share2 } from 'lucide-react';

export const PlayRulesGuide: React.FC = () => {
  const rules = [
    {
      icon: <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />,
      title: '音量は「50%以上」に設定',
      desc: '消音（ミュート）はノーカウントの可能性あり。音を出せない時はイヤホンを挿すか、ブラウザタブを消音に！',
    },
    {
      icon: <Eye className="w-4 h-4 text-rose-400 shrink-0" />,
      title: '最初から最後までフル尺再生',
      desc: 'YouTubeは再生維持率を最重視します。途中で飛ばさず、標準速度（1.0倍速）で最後まで見切るのが効果的！',
    },
    {
      icon: <RefreshCcw className="w-4 h-4 text-blue-400 shrink-0" />,
      title: '単独ループはNG（再生リスト推奨）',
      desc: '同じ動画の単独リピートはスパム判定されます。間に他の動画を2〜3本挟んだ再生リストで回しましょう。',
    },
    {
      icon: <Flame className="w-4 h-4 text-amber-400 shrink-0" />,
      title: 'アプリ限定「ハイプ」全振り',
      desc: '毎週月曜0時に付与される3回分のハイプ権をBLOOM WORLDに全投入して急上昇ランキングをブースト！',
    },
    {
      icon: <Compass className="w-4 h-4 text-emerald-400 shrink-0" />,
      title: 'おすすめ・検索からクリック',
      desc: 'ホームや関連動画で見かけたら迷わずタップ！検索「ふぉ〜ゆ〜 BLOOM WORLD」からの流入も効果絶大。',
    },
    {
      icon: <Share2 className="w-4 h-4 text-pink-400 shrink-0" />,
      title: '見終わったら高評価＆コメント',
      desc: '見終わったら必ず高評価！定型文ではなく自分の言葉で感想や秒数（○:○○）を書き込みましょう。',
    },
  ];

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/20 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
        <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
          <span>💡 再生貢献の要点（カウントされるための鉄則）</span>
        </h3>
        <span className="text-[11px] text-slate-400">正しい再生で確実に貢献！</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {rules.map((rule, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-2.5 text-xs"
          >
            <div className="mt-0.5 p-1 rounded-md bg-slate-800 border border-slate-700/60">
              {rule.icon}
            </div>
            <div className="space-y-0.5">
              <strong className="text-slate-100 font-bold block">
                {rule.title}
              </strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {rule.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
