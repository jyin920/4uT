import React, { useState, useEffect, useCallback } from 'react';
import { CampaignHeader } from './components/CampaignHeader';
import { PlayerSection } from './components/PlayerSection';
import { YourViewMattersBanner } from './components/YourViewMattersBanner';
import { ProgressCard1M } from './components/ProgressCard1M';
import { SimpleMilestoneTimeline } from './components/SimpleMilestoneTimeline';
import { ShareCampaignSection } from './components/ShareCampaignSection';
import { PlayRulesGuide } from './components/PlayRulesGuide';
import { TransitionChart } from './components/TransitionChart';
import { VideoMetadata, VideoSnapshot, Roadmap1MData } from './types';
import { ChevronDown, ChevronUp, BarChart3, ExternalLink } from 'lucide-react';

const VIDEO_ID = 'Rv_unO1n6U8';

export default function App() {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [rawHistory, setRawHistory] = useState<VideoSnapshot[]>([]);
  const [roadmap1M, setRoadmap1M] = useState<Roadmap1MData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDetailedCharts, setShowDetailedCharts] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [statsRes, historyRes, projRes] = await Promise.all([
        fetch(`/api/youtube/stats?videoId=${VIDEO_ID}`),
        fetch(`/api/youtube/history?videoId=${VIDEO_ID}`),
        fetch(`/api/youtube/projections?videoId=${VIDEO_ID}`),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setMetadata(statsData);
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setRawHistory(historyData.rawHistory || historyData.history || []);
      }

      if (projRes.ok) {
        const projData = await projRes.json();
        setRoadmap1M(projData.roadmap1M || null);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // Subtle background auto-refresh every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      fetchData(false);
    }, 30000);
    return () => clearInterval(timer);
  }, [fetchData]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/youtube/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: VIDEO_ID }),
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`YouTube同期完了: 現在 ${data.currentViews.toLocaleString()} 回再生！`);
        fetchData(false);
      } else {
        fetchData(true);
        showToast('最新データを更新しました');
      }
    } catch {
      fetchData(true);
      showToast('最新データを更新しました');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToShare = () => {
    const el = document.getElementById('share-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 border border-emerald-500/70 text-white px-3.5 py-2.5 rounded-xl shadow-2xl shadow-black/60 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-2 max-w-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="leading-tight">{toastMessage}</span>
        </div>
      )}

      {/* Slim Header */}
      <CampaignHeader
        metadata={metadata}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        onShareClick={scrollToShare}
      />

      {/* Main Container (Mobile-first, Max-w-3xl) */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5">
        {/* 1. First View: YouTube MV Player */}
        <section aria-label="MV再生">
          <PlayerSection videoId={VIDEO_ID} metadata={metadata} />
        </section>

        {/* 2. Emphasize that YOUR view matters tremendously */}
        <section aria-label="あなたの1再生の重要性">
          <YourViewMattersBanner />
        </section>

        {/* 3. 1,000,000 Views Progress & Realistic Target Time */}
        <section aria-label="100万回再生進捗状況">
          <ProgressCard1M metadata={metadata} roadmap={roadmap1M} />
        </section>

        {/* 4. Simple Milestone History Timeline */}
        <section aria-label="進捗マイルストーン">
          <SimpleMilestoneTimeline
            currentViews={metadata?.currentViews || 98603}
            history={rawHistory}
          />
        </section>

        {/* 5. 1-Tap SNS Share */}
        <section id="share-section" aria-label="SNSシェア">
          <ShareCampaignSection metadata={metadata} onCopySuccess={showToast} />
        </section>

        {/* 6. Concise Playback Rules */}
        <section aria-label="再生のコツ">
          <PlayRulesGuide />
        </section>

        {/* 7. Collapsible Deep Dive Chart */}
        <section className="pt-1">
          <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setShowDetailedCharts((prev) => !prev)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-800/40 transition cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-slate-200">
                  詳細な推移グラフを見る
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {rawHistory.length}件
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span>{showDetailedCharts ? '閉じる' : '開く'}</span>
                {showDetailedCharts ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </div>
            </button>

            {showDetailedCharts && (
              <div className="p-4 border-t border-slate-800">
                <TransitionChart
                  rawHistory={rawHistory}
                  forecastPoints={roadmap1M?.forecastPoints}
                />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Slim Mobile-Friendly Footer */}
      <footer className="mt-8 border-t border-slate-800/80 bg-[#0c121e] py-5 text-xs text-slate-400">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px]">
          <div>
            <span className="font-bold text-white">ふぉ〜ゆ〜「BLOOM WORLD」100万回再生応援プロジェクト</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <ExternalLink className="w-3 h-3" />
              <span>YouTube公式MV</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
