import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, BarChart3, TrendingUp, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { VideoSnapshot, FutureForecastPoint } from '../types';
import { formatNumber, formatJapaneseViews, formatJapaneseCompact } from '../utils/formatters';

interface TransitionChartProps {
  rawHistory: VideoSnapshot[];
  smoothedHistory?: VideoSnapshot[];
  forecastPoints?: FutureForecastPoint[];
}

type ViewMode = 'cumulative' | 'velocity' | 'forecast1M';

export const TransitionChart: React.FC<TransitionChartProps> = ({
  rawHistory = [],
  forecastPoints = [],
}) => {
  // Available views: Cumulative (Real), Velocity (Real), 1M Forecast (Diurnal Roadmap)
  const [viewMode, setViewMode] = useState<ViewMode>('cumulative');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Playback / scrubber state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [scrubberIndex, setScrubberIndex] = useState<number | null>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Active dataset: strictly based on real measured facts
  const activeDataset: VideoSnapshot[] = useMemo(() => {
    if (viewMode === 'forecast1M') {
      const mappedForecast: VideoSnapshot[] = forecastPoints.map((fp) => ({
        timestamp: fp.timestamp,
        jstTime: fp.jstTime,
        views: fp.views,
        delta: 0,
        velocity: fp.velocity,
        likes: rawHistory.length > 0 ? rawHistory[rawHistory.length - 1].likes : 18791,
        likeRatio: 0,
        comments: rawHistory.length > 0 ? rawHistory[rawHistory.length - 1].comments : 4284,
        note: fp.periodLabel,
        isMilestone: fp.views >= 1000000,
        source: 'live_system',
      }));
      return [...rawHistory, ...mappedForecast];
    }
    return rawHistory;
  }, [viewMode, rawHistory, forecastPoints]);

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setScrubberIndex((prev) => {
          const next = (prev === null ? 0 : prev) + 1;
          if (next >= activeDataset.length) {
            setIsPlaying(false);
            return activeDataset.length - 1;
          }
          return next;
        });
      }, 500);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, activeDataset.length]);

  // SVG coordinate dimensions constants
  const svgWidth = 940;
  const svgHeight = 380;
  const padLeft = 70;
  const padRight = 45;
  const padTop = 38;
  const padBottom = 54;

  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  // Real-time calculation: Horizontal axis is strictly proportional to actual elapsed time
  const tMin = useMemo(() => {
    if (activeDataset.length === 0) return Date.now();
    return new Date(activeDataset[0].timestamp).getTime();
  }, [activeDataset]);

  const rawLastTime = useMemo(() => {
    if (rawHistory.length === 0) return tMin;
    return new Date(rawHistory[rawHistory.length - 1].timestamp).getTime();
  }, [rawHistory, tMin]);

  const tMax = useMemo(() => {
    if (activeDataset.length === 0) return tMin + 4 * 3600 * 1000;
    if (viewMode === 'forecast1M') {
      return new Date(activeDataset[activeDataset.length - 1].timestamp).getTime();
    }
    return Math.max(rawLastTime, tMin + 4 * 3600 * 1000); // at least 4 hours window
  }, [activeDataset, viewMode, rawLastTime, tMin]);

  const timeSpanMs = Math.max(1000, tMax - tMin);

  // Generate real-time X-axis ticks (at exact, equal clock time intervals)
  // Hook called unconditionally
  const timeTicks = useMemo(() => {
    if (activeDataset.length === 0) return [];
    const ticks: { timeMs: number; label: string; subLabel?: string; x: number }[] = [];
    if (viewMode === 'forecast1M') {
      // For multi-day forecast: step every 12 hours (00:00 & 12:00 JST)
      const stepMs = 12 * 3600 * 1000;
      const startRound = Math.ceil((tMin + 9 * 3600 * 1000) / stepMs) * stepMs - 9 * 3600 * 1000;
      for (let t = startRound; t <= tMax; t += stepMs) {
        const d = new Date(t + 9 * 3600 * 1000);
        const m = d.getUTCMonth() + 1;
        const day = d.getUTCDate();
        const hh = String(d.getUTCHours()).padStart(2, '0');
        const mm = String(d.getUTCMinutes()).padStart(2, '0');
        const x = padLeft + ((t - tMin) / timeSpanMs) * chartWidth;
        if (x >= padLeft && x <= svgWidth - padRight) {
          ticks.push({
            timeMs: t,
            label: `${hh}:${mm}`,
            subLabel: `${m}/${day}`,
            x,
          });
        }
      }
    } else {
      // For real-time view (~3-6 hours): step every 30 minutes or 1 hour
      const spanHours = timeSpanMs / (3600 * 1000);
      const stepMs = spanHours > 8 ? 2 * 3600 * 1000 : spanHours > 3 ? 3600 * 1000 : 30 * 60 * 1000;

      const startRound = Math.ceil((tMin + 9 * 3600 * 1000) / stepMs) * stepMs - 9 * 3600 * 1000;
      for (let t = startRound; t <= tMax; t += stepMs) {
        const d = new Date(t + 9 * 3600 * 1000);
        const hh = String(d.getUTCHours()).padStart(2, '0');
        const mm = String(d.getUTCMinutes()).padStart(2, '0');
        const x = padLeft + ((t - tMin) / timeSpanMs) * chartWidth;
        if (x >= padLeft + 15 && x <= svgWidth - padRight - 15) {
          ticks.push({
            timeMs: t,
            label: `${hh}:${mm}`,
            subLabel: 'JST',
            x,
          });
        }
      }
    }
    return ticks;
  }, [activeDataset.length, tMin, tMax, timeSpanMs, viewMode, chartWidth, padLeft, padRight, svgWidth]);

  // Loading state placeholder if activeDataset is empty
  if (activeDataset.length === 0) {
    return (
      <div className="h-80 bg-[#111827] border border-slate-800 rounded-xl flex items-center justify-center">
        <span className="text-slate-500 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 animate-spin text-rose-500" />
          推移データを読込中...
        </span>
      </div>
    );
  }

  // Sliced for playback
  const effectiveLength = scrubberIndex !== null ? scrubberIndex + 1 : activeDataset.length;
  const currentHistory = activeDataset.slice(0, Math.max(1, effectiveLength));
  const currentSnapshot = hoverIndex !== null
    ? activeDataset[hoverIndex]
    : currentHistory[currentHistory.length - 1];

  // Time-to-X coordinate mapper
  const getTimeX = (timeIso: string) => {
    const t = new Date(timeIso).getTime();
    const clampedT = Math.max(tMin, Math.min(tMax, t));
    return padLeft + ((clampedT - tMin) / timeSpanMs) * chartWidth;
  };

  // Max calculations
  const maxViews = viewMode === 'forecast1M'
    ? 1100000
    : Math.max(...activeDataset.map((h) => h.views), 110000);
  const maxVelocity = Math.max(...activeDataset.map((h) => h.velocity), 125000);

  const currentMax = viewMode === 'velocity' ? maxVelocity : maxViews;

  const getY = (val: number) => {
    if (currentMax === 0) return svgHeight - padBottom;
    return padTop + chartHeight - (val / currentMax) * chartHeight;
  };

  // Calculated Point Coordinates based on REAL TIME
  const points = currentHistory.map((h, i) => {
    const val = viewMode === 'velocity' ? h.velocity : h.views;
    return {
      x: getTimeX(h.timestamp),
      y: getY(val),
      data: h,
      index: i,
    };
  });

  // Polyline path generator for real-world factual data
  const makeLinePath = (ptList: { x: number; y: number }[]) => {
    if (ptList.length === 0) return '';
    if (ptList.length === 1) return `M ${ptList[0].x.toFixed(2)} ${ptList[0].y.toFixed(2)}`;
    return ptList.reduce(
      (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`,
      ''
    );
  };

  const linePath = makeLinePath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${svgHeight - padBottom} L ${points[0].x.toFixed(2)} ${svgHeight - padBottom} Z`
    : '';

  // Y-axis grid ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map((ratio) => {
    const val = Math.round(currentMax * ratio);
    return { val, y: getY(val) };
  });

  // Milestone Reference Lines
  const milestone100kY = viewMode !== 'velocity' && viewMode !== 'forecast1M' ? getY(100000) : null;
  const milestone1MY = viewMode === 'forecast1M' ? getY(1000000) : null;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
      {/* Top Header & Real-Data View Selectors */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">再生数・時速推移アナリティクス</h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-rose-950/70 text-rose-300 border border-rose-800/60 flex items-center gap-1">
              <Clock className="w-3 h-3 text-rose-400" />
              実時間スケール軸（等間隔時間基準）
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
              実測生データ完全準拠（平滑化なし）
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            {viewMode === 'cumulative' && '横軸は実際の経過時間比率に基づき正確にプロット。プレミア公開（0:00）からの真の再生数推移'}
            {viewMode === 'velocity' && '実測タイムスタンプ間の時間差から算出した真の増加時速（views/h）'}
            {viewMode === 'forecast1M' && '現在までの実測データに、日中・夜間の視聴サイクル（サーカディアンモデル）を連結した100万回再生予測'}
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => {
                setViewMode('cumulative');
                setScrubberIndex(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'cumulative'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>累計再生数 (実測)</span>
            </button>

            <button
              onClick={() => {
                setViewMode('velocity');
                setScrubberIndex(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'velocity'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>増加時速 (実測)</span>
            </button>

            <button
              onClick={() => {
                setViewMode('forecast1M');
                setScrubberIndex(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'forecast1M'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>100万再生予測</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Info bar for Hovered / Scrubber checkpoint */}
      {currentSnapshot && (
        <div className="my-2 py-2.5 px-4 bg-slate-900/90 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              実測日時:
            </span>
            <span className="text-white font-mono font-semibold">{currentSnapshot.jstTime}</span>
            {currentSnapshot.note && (
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                  currentSnapshot.note.includes('100万') || currentSnapshot.note.includes('100,000')
                    ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                    : 'bg-rose-950/60 text-rose-300 border-rose-900/60'
                }`}
              >
                {currentSnapshot.note}
              </span>
            )}
            {currentSnapshot.source === 'live_system' && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                自動取得LIVE
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-slate-300 font-mono tabular-nums">
            <span>
              再生数: <strong className="text-white">{formatNumber(currentSnapshot.views)}</strong> 回
              <span className="text-rose-400 ml-1">({formatJapaneseViews(currentSnapshot.views)})</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>
              時速: <strong className="text-amber-400">+{formatNumber(currentSnapshot.velocity)}</strong> 回/h
            </span>
            {currentSnapshot.likes > 0 && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>高評価: <strong className="text-pink-400">{formatNumber(currentSnapshot.likes)}</strong> 件</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* SVG Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible cursor-crosshair drop-shadow-sm"
        >
          <defs>
            <linearGradient id="roseRealGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#e11d48" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#881337" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="emeraldForecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#059669" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="amberVelocityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
            </linearGradient>

            <filter id="realGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#f43f5e" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Horizontal Grid lines and Y-axis text */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padLeft}
                y1={tick.y}
                x2={svgWidth - padRight}
                y2={tick.y}
                stroke="#1e293b"
                strokeDasharray={i === 0 ? '' : '3 3'}
                strokeWidth="1"
              />
              <text
                x={padLeft - 10}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[11px] fill-slate-400 font-mono select-none"
              >
                {viewMode === 'velocity'
                  ? `${formatJapaneseCompact(tick.val)}/h`
                  : formatJapaneseCompact(tick.val)}
              </text>
            </g>
          ))}

          {/* Vertical Real-Time Grid Lines & Clock Ticks */}
          {timeTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={tick.x}
                y1={padTop}
                x2={tick.x}
                y2={svgHeight - padBottom}
                stroke="#1e293b"
                strokeDasharray="2 3"
                strokeWidth="1"
              />
              <text
                x={tick.x}
                y={svgHeight - padBottom + 16}
                textAnchor="middle"
                className="text-[11px] fill-slate-300 font-mono font-medium select-none"
              >
                {tick.label}
              </text>
              {tick.subLabel && (
                <text
                  x={tick.x}
                  y={svgHeight - padBottom + 28}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-500 font-mono select-none"
                >
                  {tick.subLabel}
                </text>
              )}
            </g>
          ))}

          {/* Premiere Start Marker (Left Edge) */}
          <g>
            <line
              x1={padLeft}
              y1={padTop}
              x2={padLeft}
              y2={svgHeight - padBottom}
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <text
              x={padLeft}
              y={svgHeight - padBottom + 16}
              textAnchor="start"
              className="text-[10px] fill-slate-400 font-mono select-none"
            >
              00:00 (公開)
            </text>
          </g>

          {/* 100,000 Views Milestone line */}
          {milestone100kY !== null && milestone100kY >= padTop && milestone100kY <= svgHeight - padBottom && (
            <g>
              <line
                x1={padLeft}
                y1={milestone100kY}
                x2={svgWidth - padRight}
                y2={milestone100kY}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth="1.5"
                opacity="0.9"
              />
              <text
                x={svgWidth - padRight - 5}
                y={milestone100kY - 6}
                textAnchor="end"
                className="text-[11px] fill-emerald-400 font-mono font-medium select-none"
              >
                ★ 100,000回再生 (10万回達成ライン)
              </text>
            </g>
          )}

          {/* 1,000,000 Views Goal milestone line */}
          {milestone1MY !== null && milestone1MY >= padTop && milestone1MY <= svgHeight - padBottom && (
            <g>
              <line
                x1={padLeft}
                y1={milestone1MY}
                x2={svgWidth - padRight}
                y2={milestone1MY}
                stroke="#f59e0b"
                strokeDasharray="5 3"
                strokeWidth="2"
                opacity="0.95"
              />
              <text
                x={svgWidth - padRight - 5}
                y={milestone1MY - 7}
                textAnchor="end"
                className="text-[12px] fill-amber-300 font-mono font-bold select-none"
              >
                ★ 目標: 1,000,000回再生 (ミリオン到達ライン)
              </text>
            </g>
          )}

          {/* Velocity Mode: Real Measured Rate Bars */}
          {viewMode === 'velocity' && (
            <g>
              {points.map((p, i) => {
                if (i === 0) return null; // Skip 00:00 baseline
                const barWidth = 16;
                const barHeight = Math.max(2, svgHeight - padBottom - p.y);
                const isHovered = hoverIndex === i;
                return (
                  <g key={i}>
                    <rect
                      x={p.x - barWidth / 2}
                      y={p.y}
                      width={barWidth}
                      height={barHeight}
                      rx="3"
                      fill="url(#amberVelocityGradient)"
                      className={`transition-all duration-150 ${
                        isHovered ? 'stroke-white stroke-1 opacity-100' : 'opacity-85 hover:opacity-100'
                      }`}
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="3"
                      className="fill-amber-300 stroke-slate-900 stroke-1"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Cumulative & 1M Forecast Lines */}
          {viewMode !== 'velocity' && (
            <>
              <path
                d={areaPath}
                fill={viewMode === 'forecast1M' ? 'url(#emeraldForecastGradient)' : 'url(#roseRealGradient)'}
              />
              <path
                d={linePath}
                fill="none"
                stroke={viewMode === 'forecast1M' ? '#10b981' : '#f43f5e'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#realGlow)"
              />
            </>
          )}

          {/* Real Data Points */}
          {points.map((p, i) => {
            const isHovered = hoverIndex === i;
            const isMilestone = p.data.isMilestone;
            const isLive = p.data.source === 'live_system';

            const fillClass = isMilestone
              ? 'fill-amber-400 stroke-slate-950 stroke-2'
              : isLive
              ? 'fill-emerald-400 stroke-slate-950 stroke-1'
              : 'fill-rose-400 stroke-slate-950 stroke-1';

            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6.5 : isMilestone ? 5 : 3.5}
                  className={`transition-all duration-150 ${
                    isHovered ? 'fill-white stroke-rose-500 stroke-2 scale-125' : fillClass
                  }`}
                />
              </g>
            );
          })}

          {/* Hover Crosshair */}
          {hoverIndex !== null && points[hoverIndex] && (
            <g>
              <line
                x1={points[hoverIndex].x}
                y1={padTop}
                x2={points[hoverIndex].x}
                y2={svgHeight - padBottom}
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={points[hoverIndex].x}
                cy={points[hoverIndex].y}
                r="6.5"
                className="fill-white stroke-rose-500 stroke-2"
              />
            </g>
          )}

          {/* Interactive Mouse Hover Columns along Real-Time X coordinates */}
          {points.map((p, i) => {
            const prevX = i > 0 ? points[i - 1].x : padLeft;
            const nextX = i < points.length - 1 ? points[i + 1].x : svgWidth - padRight;
            const colLeft = (prevX + p.x) / 2;
            const colRight = (nextX + p.x) / 2;
            const colWidth = Math.max(12, colRight - colLeft);

            return (
              <rect
                key={i}
                x={colLeft}
                y={padTop}
                width={colWidth}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
              />
            );
          })}
        </svg>
      </div>

      {/* Analytical Legend & Reality Verification Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-1 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-rose-500 rounded" />
            <span className="text-slate-200 font-medium">公式API実測データ (生記録)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">システム直接自動巡回記録</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">節目マイルストーン (10万再生等)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>横軸: 実時間線形配置 / 人工平滑化無効化済</span>
        </div>
      </div>

      {/* Scrubber & Replay controls */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-md font-medium transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-rose-400 fill-current" />}
            <span>{isPlaying ? '一時停止' : '推移リプレイ再生'}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setScrubberIndex(null);
            }}
            title="最新地点へリセット"
            className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="hidden sm:inline text-slate-400 font-mono text-[11px]">
            {scrubberIndex !== null
              ? `表示地点: ${activeDataset[scrubberIndex]?.jstTime}`
              : viewMode === 'forecast1M'
              ? '100万達成ロードマップ全景'
              : `最新実測値 (${activeDataset[activeDataset.length - 1]?.jstTime || ''})`}
          </span>
        </div>

        {/* Range slider for scrubbing */}
        <div className="flex items-center gap-3 w-full sm:w-72">
          <span className="text-[11px] text-slate-500 shrink-0 font-mono">00:00</span>
          <input
            type="range"
            min={0}
            max={activeDataset.length - 1}
            value={scrubberIndex !== null ? scrubberIndex : activeDataset.length - 1}
            onChange={(e) => {
              setIsPlaying(false);
              setScrubberIndex(Number(e.target.value));
            }}
            aria-label="タイムラインスライダー"
            className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <span className="text-[11px] text-slate-400 shrink-0 font-mono">
            {viewMode === 'forecast1M' ? '100万' : '最新'}
          </span>
        </div>
      </div>
    </div>
  );
};
