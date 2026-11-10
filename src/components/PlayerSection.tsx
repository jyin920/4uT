import React from 'react';
import { Volume2, AlertCircle, ExternalLink, ListMusic, Play } from 'lucide-react';
import { VideoMetadata } from '../types';

interface PlayerSectionProps {
  videoId?: string;
  metadata: VideoMetadata | null;
}

export const PlayerSection: React.FC<PlayerSectionProps> = ({
  videoId = 'Rv_unO1n6U8',
  metadata,
}) => {
  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const playlistSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent('ふぉ〜ゆ〜 BLOOM WORLD 再生リスト')}`;

  return (
    <div className="bg-[#111827] border border-rose-500/30 rounded-2xl overflow-hidden shadow-xl shadow-black/30 space-y-0">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            ふぉ〜ゆ〜「BLOOM WORLD」MV
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold shrink-0">
            公式
          </span>
        </div>

        <a
          href={youtubeWatchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shrink-0 cursor-pointer"
        >
          <ExternalLink className="w-3 h-3" />
          <span>YouTubeで開く</span>
        </a>
      </div>

      {/* Embedded YouTube Player (Full First View) */}
      <div className="relative w-full aspect-video bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`}
          title="ふぉ〜ゆ〜「BLOOM WORLD」MV"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* Crucial Tips & Playback Actions directly under video */}
      <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800 space-y-2.5">
        <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 font-medium">
            <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">音量50%以上（消音NG・イヤホン可）</span>
          </div>

          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">最後までフル尺（1.0倍速）</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
          <span>※ 単独ループはスパム判定されるため注意</span>
          <a
            href={playlistSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>再生リストで回す</span>
          </a>
        </div>
      </div>
    </div>
  );
};
