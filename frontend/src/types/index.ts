export type DriverState = 'CALM' | 'CONCERNED' | 'STRESSED' | 'TIRED';

export type TopicCategory = 
  | 'TYRE / GRIP'
  | 'CAR BALANCE'
  | 'ENGINE / TEMP'
  | 'BRAKE BIAS'
  | 'TRAFFIC / GAP'
  | 'STRATEGY'
  | 'GENERAL';

export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export type InsightPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type InsightCategory = 
  | 'Performance Risk'
  | 'Driver State'
  | 'Tyre Concern'
  | 'Communication Alert'
  | 'Trend';

export interface RadioCall {
  id: string;
  timestamp: string; // e.g. "14:32:05"
  lapNumber: number;
  driverId: string;
  driverName: string;
  channel: string; // e.g. "CH-1 PRIMARY"
  audioDuration: number; // in seconds
  transcript: string;
  highlightedPhrase?: string;
  topic: TopicCategory;
  sentiment: Sentiment;
  detectedState: DriverState;
  confidence: number; // e.g. 87 for 87%
  keyPhrases: string[];
  sector?: 'Sector 1' | 'Sector 2' | 'Sector 3' | 'Full Lap';
}

export interface LapTelemetry {
  lapNumber: number;
  lapTimeSeconds: number; // e.g. 84.6
  lapTimeFormatted: string; // e.g. "1:24.6"
  deltaVsPrevious: number; // +1.8
  deltaVsBest: number; // +2.2
  stressScore: number; // 0 to 100 scale
  driverState: DriverState;
  sector1: number; // e.g. 28.4
  sector2: number; // e.g. 31.2
  sector3: number; // e.g. 25.0
  tyreAgeLaps: number;
  tyreCompound: 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE';
  rearTyreTempC: number;
  speedMaxKph: number;
  radioCallId?: string; // associated radio call if any
}

export interface StateDistribution {
  calm: number;
  concerned: number;
  stressed: number;
  tired: number;
}

export interface EngineerInsight {
  id: string;
  priority: InsightPriority;
  category: InsightCategory;
  timestamp: string;
  lapNumber: number;
  title: string;
  summary: string;
  primaryConcern: string;
  evidence: string[];
  relatedRadioCallId?: string;
  actionSuggested?: string;
  acknowledged?: boolean;
}

export interface DriverProfile {
  id: string;
  name: string;
  carNumber: string;
  teamName: string; // non-branded e.g. "Velocity Engineering #44"
  sessionName: string;
  currentLap: number;
  totalLaps: number;
  currentStatus: 'LIVE' | 'IN PIT' | 'OUT LAP' | 'FINISHED';
  currentLapTime: string;
  lastLapDelta: string;
  performanceRisk: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
  currentState: DriverState;
  stateConfidence: number;
  stateTrend: 'Increasing' | 'Stable' | 'Decreasing';
  currentTopic: TopicCategory;
  stateDistribution: StateDistribution;
}

export interface SessionHistoryFilter {
  state?: DriverState | 'ALL';
  topic?: TopicCategory | 'ALL';
  searchQuery?: string;
  sortBy?: 'lap' | 'time' | 'confidence' | 'stress';
  sortOrder?: 'asc' | 'desc';
}
