import { VideoSnapshot } from '../types';

export function formatNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('en-US');
}

export function formatJapaneseViews(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0回';
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(2)}億回`;
  }
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万回`;
  }
  return `${num.toLocaleString()}回`;
}

export function formatJapaneseCompact(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toLocaleString();
}

export function formatDurationMinutes(mins: number): string {
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hours === 0) return `${remainingMins}分`;
  return `${hours}時間 ${remainingMins}分`;
}

export function exportSnapshotsToCSV(snapshots: VideoSnapshot[], videoTitle: string): void {
  const headers = ['日時(ISO)', 'JST日本時間', '累計再生数', '区間増加数', '推定時速(回/h)', '高評価数', '高評価率(%)', 'コメント数', '備考'];
  const rows = snapshots.map((s) => [
    `"${s.timestamp}"`,
    `"${s.jstTime}"`,
    s.views,
    s.delta,
    s.velocity,
    s.likes,
    s.likeRatio,
    s.comments || 0,
    `"${s.note || ''}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `YouTube_Views_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
