import React from 'react';
import { RefreshCw, Share2, Sparkles } from 'lucide-react';
import { VideoMetadata } from '../types';

interface CampaignHeaderProps {
  metadata: VideoMetadata | null;
  onRefresh: () => void;
  isLoading: boolean;
  onShareClick: () => void;
}

export const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  metadata,
  onRefresh,
  isLoading,
  onShareClick,
}) => {
  const formatTime = (iso?: string) => {
    if (!iso) return '--:--';
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Title */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base sm:text-lg font-black tracking-tight text-white truncate">
            ふぉ〜ゆ〜 <span className="text-rose-400">BLOOM WORLD</span>
          </span>
          <span className="hidden xs:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
            100万回再生応援
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition cursor-pointer disabled:opacity-50"
            title="最新再生数を取得"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">更新 {formatTime(metadata?.lastUpdated)}</span>
          </button>

          <button
            onClick={onShareClick}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>シェア</span>
          </button>
        </div>
      </div>
    </header>
  );
};
