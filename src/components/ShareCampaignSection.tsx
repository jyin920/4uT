import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, ThumbsUp } from 'lucide-react';
import { VideoMetadata } from '../types';
import { formatNumber } from '../utils/formatters';

interface ShareCampaignSectionProps {
  metadata: VideoMetadata | null;
  onCopySuccess: (msg: string) => void;
}

export const ShareCampaignSection: React.FC<ShareCampaignSectionProps> = ({
  metadata,
  onCopySuccess,
}) => {
  const currentViewsStr = metadata?.currentViews ? formatNumber(metadata.currentViews) : '98,603';
  const youtubeUrl = `https://www.youtube.com/watch?v=Rv_unO1n6U8`;

  // Required hashtags by user:
  // #ふぉ～ゆ～ #BLOOMWORLD #BLOOMWORLD_MV #ふぉ〜ゆ〜CDデビュー
  const hashtags = ['ふぉ～ゆ～', 'BLOOMWORLD', 'BLOOMWORLD_MV', 'ふぉ〜ゆ〜CDデビュー'];
  const hashtagString = hashtags.map((h) => `#${h}`).join(' ');

  const directions = [
    {
      id: 'highlight',
      label: '好きなシーンを推す',
      initialText: `【ここに好きなシーンや推しポイントを自分の言葉で！】\n\nふぉ〜ゆ〜『BLOOM WORLD』MV 100万回再生目指して応援中！✨\n${youtubeUrl}\n\n${hashtagString}`,
    },
    {
      id: 'newbie',
      label: '初見さんへおすすめ',
      initialText: `【ここに初めて見る人へのおすすめ理由を自分の言葉で！】\n\nふぉ〜ゆ〜のCDデビュー曲『BLOOM WORLD』MV、ぜひ一度見てみて！🕺🌸\n${youtubeUrl}\n\n${hashtagString}`,
    },
    {
      id: 'stats',
      label: '現在の再生数で速報',
      initialText: `ふぉ〜ゆ〜『BLOOM WORLD』MV、現在【${currentViewsStr}回再生】突破！🌸\n目指せ100万回ミリオン！\n【ここに一言応援メッセージ！】\n\n${youtubeUrl}\n\n${hashtagString}`,
    },
  ];

  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState(0);
  const [customText, setCustomText] = useState(directions[0].initialText);
  const [isCopied, setIsCopied] = useState(false);

  const handleSelectDirection = (idx: number) => {
    setSelectedDirectionIndex(idx);
    setCustomText(directions[idx].initialText);
  };

  const handleShareX = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(customText)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareLine = () => {
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(customText)}`;
    window.open(lineUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(customText);
      setIsCopied(true);
      onCopySuccess('ポスト用テキストをコピーしました！');
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      onCopySuccess('コピーできませんでした');
    }
  };

  const handleCopyPageUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      onCopySuccess('応援ページのURLをコピーしました！');
    } catch {
      onCopySuccess('URLをコピーできませんでした');
    }
  };

  return (
    <div id="share-section" className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/20 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-rose-400" />
          <h3 className="font-bold text-white text-sm">
            SNSでシェア（自分の言葉で発信）
          </h3>
        </div>
        <button
          onClick={handleCopyPageUrl}
          className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
        >
          ページURLをコピー
        </button>
      </div>

      {/* 3 Simple Direction Tabs */}
      <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
        {directions.map((dir, idx) => (
          <button
            key={dir.id}
            onClick={() => handleSelectDirection(idx)}
            className={`py-1.5 px-2 rounded-lg text-center transition cursor-pointer text-[11px] sm:text-xs truncate ${
              selectedDirectionIndex === idx
                ? 'bg-rose-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {dir.label}
          </button>
        ))}
      </div>

      {/* Share Textarea */}
      <div className="space-y-1.5">
        <textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          rows={5}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-rose-500 transition resize-none"
          placeholder="【 】の部分に自分の言葉を入れてポストしよう！"
        />

        <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-400">
          <span>タグ:</span>
          {hashtags.map((tag) => (
            <span key={tag} className="text-rose-300 font-mono">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
        <button
          onClick={handleShareX}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black font-bold text-xs shadow transition cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-black" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X でポストする</span>
        </button>

        <button
          onClick={handleShareLine}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs shadow transition cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>LINEで送る</span>
        </button>

        <button
          onClick={handleCopyText}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">コピー完了</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>文面コピー</span>
            </>
          )}
        </button>
      </div>

      {/* YouTube Comment Tips (Simple & Concise) */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
          <span>YouTubeコメントのコツ（定型文コピペNG・自分の言葉で）</span>
        </div>
        <p className="text-slate-400 leading-snug">
          ・<strong className="text-white">秒数（○:○○）を入れる:</strong> 見直されやすくなり動画の再生維持率がアップ！<br />
          ・<strong className="text-white">初見向けの見どころ:</strong> ダンスのキレや大人の色気など好きなポイントを率直に！
        </p>
      </div>
    </div>
  );
};
