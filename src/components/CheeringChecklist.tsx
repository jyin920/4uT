import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Trophy, Sparkles, Heart, Flame } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
  points: number;
}

export const CheeringChecklist: React.FC = () => {
  const defaultItems: ChecklistItem[] = [
    {
      id: 'full_play',
      label: '① 音量50%以上・標準1.0倍速でフル尺再生した！',
      detail: '途中で飛ばさず最後まで見切って視聴維持率UP',
      points: 20,
    },
    {
      id: 'thumbs_up',
      label: '② YouTube公式で「高評価」を押した！',
      detail: 'エンゲージメントを高めておすすめ動画へ推薦',
      points: 15,
    },
    {
      id: 'comment',
      label: '③ 見どころや感想を「自分の言葉で」コメントした！',
      detail: '定型文ではなく自分の生の声で！他のファンのコメントにもいいね',
      points: 20,
    },
    {
      id: 'sns_share',
      label: '④ 推しポイントを一言添えてSNSにシェアした！',
      detail: '#ふぉ～ゆ～ #BLOOMWORLD 等の指定タグとともに魅力発信',
      points: 20,
    },
    {
      id: 'click_search',
      label: '⑤ おすすめや検索から動画をクリックして開いた！',
      detail: 'クリック率を高めてAIに「需要あり」と認知させる',
      points: 15,
    },
    {
      id: 'hype',
      label: '⑥ （月曜0時リセット）アプリから「ハイプ」を投入した！',
      detail: '公開7日以内限定！週3回分をBLOOM WORLDに全振り',
      points: 10,
    },
  ];

  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bloom_checklist_checked');
      return saved ? JSON.parse(saved) : ['full_play'];
    } catch {
      return ['full_play'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bloom_checklist_checked', JSON.stringify(checkedIds));
    } catch {
      // ignore
    }
  }, [checkedIds]);

  const toggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalPoints = defaultItems.reduce((acc, item) => acc + item.points, 0);
  const earnedPoints = defaultItems
    .filter((item) => checkedIds.includes(item.id))
    .reduce((acc, item) => acc + item.points, 0);

  const isAllCompleted = checkedIds.length === defaultItems.length;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/20 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
            <Heart className="w-4 h-4 fill-pink-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>本日の応援ミッション（チェックリスト）</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                参加型
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              今日できたアクションをタップしてチェック！日々の継続がミリオンへの確実な道です
            </p>
          </div>
        </div>

        {/* Score indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">達成度:</span>
          <span className="text-pink-400 font-bold tabular-nums">
            {checkedIds.length} / {defaultItems.length} 完了
          </span>
          <span className="text-slate-500">({earnedPoints} pt)</span>
        </div>
      </div>

      {/* Checklist items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {defaultItems.map((item) => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-start gap-3 ${
                isChecked
                  ? 'bg-rose-950/20 border-rose-500/50 text-white shadow-sm'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-rose-400 fill-rose-950/50" />
                ) : (
                  <Square className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className={`text-xs font-bold block ${isChecked ? 'text-rose-200' : 'text-slate-200'}`}>
                  {item.label}
                </span>
                <span className="text-[11px] text-slate-400 block leading-tight">
                  {item.detail}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Encouragement message banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {isAllCompleted ? (
              <strong className="text-amber-300 font-bold">
                🎉 本日のミッション全達成！素晴らしい熱気です！ふぉ〜ゆ〜に想いが届いています！
              </strong>
            ) : (
              <span>
                あなたの一押しがYouTubeアルゴリズムを動かします！できることから1つずつ楽しもう🌸
              </span>
            )}
          </span>
        </div>
        <button
          onClick={() => setCheckedIds([])}
          className="text-[11px] text-slate-500 hover:text-slate-300 underline shrink-0 cursor-pointer"
        >
          リセット
        </button>
      </div>
    </div>
  );
};
