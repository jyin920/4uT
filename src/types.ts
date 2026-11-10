export interface VideoSnapshot {
  timestamp: string;
  jstTime: string;
  views: number;
  delta: number;
  velocity: number; // views/hr
  likes: number;
  likeRatio: number;
  comments: number;
  commentRatio?: number;
  note?: string;
  isMilestone?: boolean;
  source?: 'csv' | 'live_system';
}

export interface VideoMetadata {
  videoId: string;
  title: string;
  author: string;
  authorUrl: string;
  publishedAt: string;
  publishedAtJST: string;
  durationSeconds: number;
  thumbnailUrl: string;
  currentViews: number;
  currentLikes: number;
  currentComments: number;
  likeRatio: number;
  commentRatio: number;
  currentVelocity: number;
  peakVelocity: number;
  elapsedMinutes: number;
  lastUpdated: string;
  dataSource: string;
  liveSnapshotsCount?: number;
  isAutoPollingActive?: boolean;
  isOfficialApiUsed?: boolean;
}

export interface MilestoneItem {
  target: number;
  label: string;
  isReached: boolean;
  progressPercent: number;
  etaTimeJST?: string;
  etaMinutes?: number;
  etaHours?: number | string;
  description?: string;
}

export interface ProjectionScenario {
  id: string;
  name: string;
  color: string;
  day1Views: number;
  day2Views: number;
  day7Views: number;
  description: string;
  etaTo1MHours: number;
  etaTo1MDateJST: string;
}

export interface FutureForecastPoint {
  timestamp: string;
  jstTime: string;
  views: number;
  velocity: number;
  periodLabel: string;
}

export interface Roadmap1MData {
  currentViews: number;
  targetViews: number;
  remainingViews: number;
  progressPercent: number;
  organicPacePerHour: number;
  peakVelocity: number;
  standardEtaJST: string;
  standardEtaHours: number;
  viralEtaJST: string;
  viralEtaHours: number;
  conservativeEtaJST: string;
  conservativeEtaHours: number;
  requiredPace3Days: number;
  requiredPace5Days: number;
  requiredPace7Days: number;
  forecastPoints: FutureForecastPoint[];
}

export interface ProjectionData {
  videoId: string;
  currentViews: number;
  currentVelocity: number;
  milestones: MilestoneItem[];
  scenarios: ProjectionScenario[];
  roadmap1M: Roadmap1MData;
}
