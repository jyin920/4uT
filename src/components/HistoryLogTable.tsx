import React, { useState } from 'react';
import { Table, Download, ArrowUpDown, Search, Check, Sparkles, Database, Plus, CheckCircle2, Clock, FileJson, Activity } from 'lucide-react';
import { VideoSnapshot, VideoMetadata } from '../types';
import { formatNumber } from '../utils/formatters';

interface HistoryLogTableProps {
  history: VideoSnapshot[];
  onExportCSV: () => void;
  onTakeSnapshot?: () => void;
  isLoading?: boolean;
  metadata?: VideoMetadata | null;
}

type FilterCategory = 'all' | 'live' | 'csv' | 'milestones';

export const HistoryLogTable: React.FC<HistoryLogTableProps> = ({
  history,
  onExportCSV,
  onTakeSnapshot,
  isLoading = false,
  metadata,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');

  const csvCount = history.filter((h) => h.source === 'csv').length;
  const liveCount = history.filter((h) => h.source === 'live_system').length;
  const milestoneCount = history.filter((h) => h.isMilestone).length;

  const filteredHistory = history
    .filter((h) => {
      // Category filter
      if (filterCategory === 'csv' && h.source !== 'csv') return false;
      if (filterCategory === 'live' && h.source !== 'live_system') return false;
      if (filterCategory === 'milestones' && !h.isMilestone) return false;

      // Text search
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        h.jstTime.toLowerCase().includes(term) ||
        (h.note && h.note.toLowerCase().includes(term)) ||
        h.views.toString().includes(term) ||
        (h.comments && h.comments.toString().includes(term)) ||
        (h.likes && h.likes.toString().includes(term))
      );
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortAsc ? timeA - timeB : timeB - timeA;
    });

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(history, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bloom_world_snapshots_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20 space-y-0">
      {/* Real-Time Storage & System Sync Status Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white tracking-tight">推移スナップショット全蓄積ログ</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              全自動記録エンジン常時稼働中
            </span>
            <span className="text-xs text-rose-400 font-mono font-bold">
              (合計 {history.length}件 蓄積完了)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                初期CSV: <strong className="text-white font-mono">{csvCount}件</strong> + 自動/手動追記:{' '}
                <strong className="text-emerald-400 font-mono">{liveCount}件</strong>
              </span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>自動記録間隔: 5分毎の定期記録 + 200再生増/高評価変動時に即時追記</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono text-[11px]">
              永続化ファイル: <code className="text-slate-300 bg-slate-950 px-1 py-0.5 rounded">live_snapshots.json</code>
            </span>
          </div>
        </div>

        {/* Immediate snapshot trigger */}
        {onTakeSnapshot && (
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={onTakeSnapshot}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              title="今この瞬間の最新数値を新しいスナップショット行として即時記録・永続保存します"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>今すぐスナップショット記録</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Category Tabs & Search Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterCategory === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            全データ ({history.length})
          </button>
          <button
            onClick={() => setFilterCategory('live')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              filterCategory === 'live'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-emerald-400 hover:text-emerald-300 border border-slate-800'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>システム自動蓄積 ({liveCount})</span>
          </button>
          <button
            onClick={() => setFilterCategory('csv')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterCategory === 'csv'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            初期CSV実績 ({csvCount})
          </button>
          <button
            onClick={() => setFilterCategory('milestones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              filterCategory === 'milestones'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-900 text-amber-400 hover:text-amber-300 border border-slate-800'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>節目 ({milestoneCount})</span>
          </button>
        </div>

        {/* Search & Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="時刻・メモ・数値で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-rose-500 w-44"
            />
          </div>

          {/* Sort order toggle */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-medium transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortAsc ? '古い順' : '新しい順'}</span>
          </button>

          {/* Download JSON */}
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-medium transition-colors"
            title="蓄積された全スナップショットをJSON形式でダウンロード"
          >
            <FileJson className="w-3.5 h-3.5 text-amber-400" />
            <span>JSON保存</span>
          </button>

          {/* Copy JSON */}
          <button
            onClick={handleCopyJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
            <span>{copied ? 'コピー完了' : 'JSONコピー'}</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
            title="蓄積された全データをCSV形式で出力"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV出力</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">記録日時 (JST)</th>
              <th className="py-3 px-4 font-semibold text-center">種別</th>
              <th className="py-3 px-4 font-semibold text-right">累計再生数</th>
              <th className="py-3 px-4 font-semibold text-right">区間増加数</th>
              <th className="py-3 px-4 font-semibold text-right">推定時速 (回/h)</th>
              <th className="py-3 px-4 font-semibold text-right">高評価数</th>
              <th className="py-3 px-4 font-semibold text-right">高評価率</th>
              <th className="py-3 px-4 font-semibold text-right">コメント数</th>
              <th className="py-3 px-4 font-semibold">分析イベント / メモ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
            {filteredHistory.map((row, idx) => {
              const isPeakBurst = row.velocity > 100000;
              const isLive = row.source === 'live_system';
              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    isLive
                      ? 'bg-emerald-950/20 hover:bg-emerald-950/35'
                      : isPeakBurst
                      ? 'bg-rose-950/20 hover:bg-rose-950/30'
                      : 'hover:bg-slate-850/50'
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-slate-200 whitespace-nowrap">
                    <span>{row.jstTime}</span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap font-sans">
                    {isLive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded px-1.5 py-0.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        自動蓄積
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] bg-blue-500/15 text-blue-300 border border-blue-500/30 rounded px-1.5 py-0.5 font-medium">
                        CSV実績
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-white font-bold">
                    {formatNumber(row.views)}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400">
                    {row.delta > 0 ? `+${formatNumber(row.delta)}` : '-'}
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${isPeakBurst ? 'text-rose-400' : 'text-amber-400'}`}>
                    {row.velocity > 0 ? `+${formatNumber(row.velocity)}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right text-pink-400">
                    {formatNumber(row.likes)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    {row.likeRatio}%
                  </td>
                  <td className="py-3 px-4 text-right text-cyan-400">
                    {formatNumber(row.comments)}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-400 max-w-sm truncate">
                    {row.note ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                          row.isMilestone
                            ? 'bg-amber-950/90 text-amber-300 border border-amber-600/70 font-bold'
                            : isPeakBurst
                            ? 'bg-rose-600 text-white font-bold shadow-sm'
                            : isLive
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-medium'
                            : 'bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        {row.isMilestone && <Sparkles className="w-3 h-3 text-amber-300" />}
                        {row.note}
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredHistory.length === 0 && (
        <div className="py-12 text-center text-slate-500 text-xs font-medium">
          該当するスナップショットデータが見つかりませんでした
        </div>
      )}
    </div>
  );
};

