import React from 'react';
import { RefreshCw, Video, Radio, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRefresh: () => void;
  onSyncLive: () => void;
  isLoading: boolean;
  onOpenUrlModal: () => void;
  autoRefreshInterval: number; // 0 for off, 15, 30, 60
  setAutoRefreshInterval: (interval: number) => void;
  lastUpdated: string;
  liveSnapshotsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRefresh,
  onSyncLive,
  isLoading,
  onOpenUrlModal,
  autoRefreshInterval,
  setAutoRefreshInterval,
  lastUpdated,
  liveSnapshotsCount = 0,
}) => {
  const navItems = [
    { id: 'overview', label: '概要ダッシュボード' },
    { id: 'roadmap1m', label: '★ 100万再生ロードマップ' },
    { id: 'charts', label: '推移・時速チャート' },
    { id: 'milestones', label: 'マイルストーン' },
    { id: 'table', label: '記録ログ' },
  ];

  const formatLastUpdated = (iso: string) => {
    if (!iso) return '--:--:--';
    const d = new Date(iso);
    return d.toLocaleTimeString('ja-JP', { hour12: false });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-950/40">
            <Radio className="w-4 h-4" />
          </div>
          <button
            onClick={() => setActiveTab('overview')}
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-rose-400 transition-colors"
          >
            BLOOM TRACKER
          </button>

          {/* Real Live Poller indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/60 border border-emerald-800/60 rounded text-[11px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>全自動監視中</span>
            {liveSnapshotsCount > 0 && (
              <span className="text-emerald-300 font-bold">+{liveSnapshotsCount}件</span>
            )}
          </div>
        </div>

        {/* Zone 2: 4-5 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const is1M = item.id === 'roadmap1m';
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive
                    ? is1M
                      ? 'text-amber-400 font-bold border-b-2 border-amber-400'
                      : 'text-rose-400 font-semibold border-b-2 border-rose-500'
                    : is1M
                    ? 'text-amber-300/80 hover:text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Live Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 pr-2 border-r border-slate-800">
            <span className="font-mono">最終同期: {formatLastUpdated(lastUpdated)}</span>
            <span aria-hidden="true">·</span>
            <select
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
              aria-label="自動同期周期"
              className="bg-slate-900 border border-slate-700/80 text-slate-300 text-xs rounded px-2 py-1 outline-none focus:border-rose-500"
            >
              <option value={15}>15秒毎同期</option>
              <option value={30}>30秒毎同期</option>
              <option value={60}>60秒毎同期</option>
              <option value={0}>手動のみ</option>
            </select>
          </div>

          {/* YouTube Force Live Sync Button */}
          <button
            onClick={onSyncLive}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/70 rounded-lg transition-colors shrink-0 disabled:opacity-50"
            title="YouTubeから最新の再生数・いいね数を即時取得・記録"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>即時ライブ同期</span>
          </button>

          <button
            onClick={onOpenUrlModal}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Video className="w-3.5 h-3.5" />
            <span>動画URL変更</span>
          </button>
        </div>
      </div>
    </header>
  );
};
