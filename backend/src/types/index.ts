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

export interface DriverProfile {
  id: string;
  name: string;
  number: number;
  team: string;
}

export interface RadioCall {
  id: string;
  driverId: string;
  driverName: string;
  lapNumber: number;
  channel: string;
  audioDuration: number;
  transcript: string;
  highlightedPhrase?: string;
  sentiment: Sentiment;
  topic: TopicCategory;
  detectedState: DriverState;
  confidence: number;
  keyPhrases: string[];
  sector?: 'Sector 1' | 'Sector 2' | 'Sector 3' | 'Full Lap';
  timestamp: string;
}

export interface LapTelemetry {
  id: string;
  driverId: string;
  lapNumber: number;
  lapTimeSeconds: number;
  lapTimeFormatted?: string; // always populated by telemetryService's enrichment step
  deltaVsPrevious?: number; // undefined for a driver's first known lap (no prior lap in the data to compare against)
  deltaVsBest?: number; // always populated by telemetryService's enrichment step
  stressScore: number;
  driverState?: DriverState; // only present when the lap has a linked radio call (radioCallId) to derive state from
  rearTyreTempC: number;
  radioCallId?: string;
}

export interface StateDistribution {
  state: DriverState;
  percentage: number;
}

export interface EngineerInsight {
  id: string;
  driverId: string;
  priority: InsightPriority;
  message: string;
  relatedRadioCallId?: string;
  timestamp: string;
  category?: InsightCategory; // populated by insightService's enrichment step (derived from the linked radio call's topic)
  lapNumber?: number; // populated by insightService's enrichment step (derived from the linked radio call)
  title?: string; // populated by insightService's enrichment step (derived from the first sentence of `message`)
  summary?: string; // populated by insightService's enrichment step (mirrors `message`)
  primaryConcern?: string; // populated by insightService's enrichment step (derived from the linked radio call's highlightedPhrase)
  evidence?: string[]; // populated by insightService's enrichment step (derived from the linked radio call's keyPhrases)
  actionSuggested?: string; // no backend source data exists to derive this — always omitted
  acknowledged?: boolean; // no persisted acknowledgment state in the backend — always false
}

export interface SessionHistoryFilter {
  driverId?: string;
  state?: DriverState;
  topic?: TopicCategory;
  search?: string;
  sortBy?: 'lapNumber' | 'stressScore' | 'timestamp';
  sortOrder?: 'asc' | 'desc';
}