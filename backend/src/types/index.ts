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

export interface DriverProfile {
  id: string;
  name: string;
  number: number;
  team: string;
}

export interface RadioCall {
  id: string;
  driverId: string;
  lapNumber: number;
  transcript: string;
  sentiment: Sentiment;
  topic: TopicCategory;
  detectedState: DriverState;
  timestamp: string;
}

export interface LapTelemetry {
  id: string;
  driverId: string;
  lapNumber: number;
  lapTimeSeconds: number;
  stressScore: number;
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
}

export interface SessionHistoryFilter {
  driverId?: string;
  state?: DriverState;
  topic?: TopicCategory;
  search?: string;
  sortBy?: 'lapNumber' | 'stressScore' | 'timestamp';
  sortOrder?: 'asc' | 'desc';
}