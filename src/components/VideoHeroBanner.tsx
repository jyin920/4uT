import React, { useState } from 'react';
import { ExternalLink, Play, Eye, Heart, MessageSquare, RefreshCw, Download, Music2, Radio, CheckCircle2, Key, Plus } from 'lucide-react';
import { VideoMetadata } from '../types';
import { formatNumber, formatDurationMinutes } from '../utils/formatters';
import { ApiKeyGuideModal } from './ApiKeyGuideModal';

interface VideoHeroBannerProps {
  metadata: VideoMetadata | null;
  onTakeSnapshot: () => void;
  onSyncLive: () => void;
  onExportCSV: () => void;
  isLoading?: boolean;
}

export const VideoHeroBanner: React.FC<VideoHeroBannerProps> = ({
  metadata,
  onTakeSnapshot,
  onSyncLive,
  onExportCSV,
  isLoading = false,
}) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  if (!metadata) {
    return (
      <div className="h-44 bg-slate-900/60 rounded-xl border border-slate-800 animate-pulse flex items-center justify-center">
        <span className="text-slate-500 text-sm">動画情報を読込中...</span>
      </div>
    );
  }

  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${metadata.videoId}`;
  const durationMin = Math.floor(metadata.durationSeconds / 60);
  const durationSec = metadata.durationSeconds % 60;
  const liveCount = metadata.liveSnapshotsCount || 0;
  const totalCount = 17 + liveCount;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20 space-y-0">
      {/* Live System Auto-Sync Banner Strip */}
      <div className="bg-emerald-950/40 border-b border-emerald-900/50 px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-emerald-300 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>
            {metadata.isOfficialApiUsed ? (
              '公式 YouTube Data API v3 連携稼働中: 公式エンドポイントから直接最新数値をリアルタイム取得中'
            ) : (
              <>
                公式YouTube Data API v3 対応（未設定時は直接取得エンジンが自動稼働）
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="ml-2 text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  <Key className="w-3 h-3" />
                  <span>[APIキー取得手順]</span>
                </button>
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px] shrink-0">
          <span>初期CSV(17件) + 自動蓄積({liveCount}件) = 合計{totalCount}件</span>
          <button
            onClick={onSyncLive}
            disabled={isLoading}
            className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>今すぐ同期</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
          {/* Left: Thumbnail & Info */}
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            {/* Thumbnail */}
            <div className="relative group shrink-0 w-full sm:w-56 aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-700/60">
              <img
                src={metadata.thumbnailUrl}
                alt={metadata.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${metadata.videoId}/hqdefault.jpg`;
                }}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                onClick={() => setShowPlayer(!showPlayer)}
                className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center text-white"
                title={showPlayer ? 'プレイヤーを閉じる' : '動画を再生'}
              >
                <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </div>
              </button>
            </div>

            {/* Title & Metadata */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-rose-400 font-medium flex items-center gap-1.5">
                  <Music2 className="w-3.5 h-3.5" />
                  結成15周年CDデビューシングル · 堂本光一プロデュース
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-emerald-400 font-mono flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" />
                  {metadata.isOfficialApiUsed ? '公式 YouTube Data API v3 接続済' : '公式API対応 / YouTube直接LIVE連携'}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {metadata.title}
              </h1>

              {/* Zero-Pill Unboxed Metadata with typographic separators */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-400">
                <a
                  href={metadata.authorUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-white underline underline-offset-2"
                >
                  {metadata.author}
                </a>
                <span aria-hidden="true">·</span>
                <span>公開: {metadata.publishedAtJST}</span>
                <span aria-hidden="true">·</span>
                <span>時間: {durationMin}分{durationSec}秒</span>
                <span aria-hidden="true">·</span>
                <span>経過: {formatDurationMinutes(metadata.elapsedMinutes)}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300 font-mono">ID: {metadata.videoId}</span>
              </div>

              {/* Fast stats preview */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Eye className="w-3.5 h-3.5 text-rose-400" />
                  <strong className="font-semibold text-white text-sm">{formatNumber(metadata.currentViews)}</strong> 回
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-500/20" />
                  <strong className="font-semibold text-white">{formatNumber(metadata.currentLikes)}</strong> いいね
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5 text-slate-200">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <strong className="font-semibold text-white">{formatNumber(metadata.currentComments)}</strong> コメント
                </span>
                <span aria-hidden="true">·</span>
                <span>高評価率 {metadata.likeRatio}%</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 pt-2 lg:pt-0">
            <button
              onClick={onSyncLive}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-emerald-950/30 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>最新データを即時取得</span>
            </button>

            <button
              onClick={onTakeSnapshot}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
              title="現在の再生数・高評価・コメント数を新しい1件として即座に蓄積保存"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>スナップショット手動保存</span>
            </button>

            <a
              href={youtubeWatchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>YouTubeで開く</span>
            </a>

            <button
              onClick={() => setShowPlayer(!showPlayer)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-850 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 text-rose-400" />
              <span>{showPlayer ? 'プレイヤー非表示' : '動画プレイヤー'}</span>
            </button>

            <button
              onClick={onExportCSV}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-850 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>最新CSV書き出し</span>
            </button>
          </div>
        </div>

        {/* Embedded Player Accordion */}
        {showPlayer && (
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden bg-black shadow-2xl border border-slate-700">
              <iframe
                src={`https://www.youtube.com/embed/${metadata.videoId}?autoplay=1&rel=0`}
                title={metadata.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}
      </div>

      {/* API Key Guide Modal */}
      <ApiKeyGuideModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />
    </div>
  );
};
