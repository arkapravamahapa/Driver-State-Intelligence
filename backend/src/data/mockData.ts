import { DriverProfile, RadioCall, LapTelemetry, EngineerInsight } from '../types';

export const drivers: DriverProfile[] = [
  { id: 'd1', name: 'Max Verstappen', number: 1, team: 'Red Bull Racing' },
  { id: 'd2', name: 'Lando Norris', number: 4, team: 'McLaren' },
  { id: 'd3', name: 'Lewis Hamilton', number: 44, team: 'Mercedes' },
  { id: 'd4', name: 'Charles Leclerc', number: 16, team: 'Ferrari' },
  { id: 'd5', name: 'Fernando Alonso', number: 14, team: 'Aston Martin' }
];

export const radioCalls: RadioCall[] = [
  {
    id: 'rc1',
    driverId: 'd2',
    lapNumber: 24,
    transcript: "The front left is completely gone, I have no grip in the slow corners. It's sliding everywhere.",
    sentiment: 'Negative',
    topic: 'TYRE / GRIP',
    detectedState: 'STRESSED',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 'rc2',
    driverId: 'd1',
    lapNumber: 15,
    transcript: "Balance feels good, let's keep this pace. Tyres are in the optimal window.",
    sentiment: 'Positive',
    topic: 'CAR BALANCE',
    detectedState: 'CALM',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 'rc3',
    driverId: 'd3',
    lapNumber: 42,
    transcript: "I'm losing concentration, drinks bottle isn't working. How many laps left?",
    sentiment: 'Negative',
    topic: 'GENERAL',
    detectedState: 'TIRED',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 'rc4',
    driverId: 'd4',
    lapNumber: 10,
    transcript: "Engine clipping heavily on the straight, check temperatures please.",
    sentiment: 'Neutral',
    topic: 'ENGINE / TEMP',
    detectedState: 'CONCERNED',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString()
  }
];

export const lapTelemetries: LapTelemetry[] = [
  // Lando Norris (Stressed due to tyres)
  { id: 'lt1', driverId: 'd2', lapNumber: 23, lapTimeSeconds: 84.2, stressScore: 65, rearTyreTempC: 102 },
  { id: 'lt2', driverId: 'd2', lapNumber: 24, lapTimeSeconds: 85.8, stressScore: 88, rearTyreTempC: 108, radioCallId: 'rc1' },
  { id: 'lt3', driverId: 'd2', lapNumber: 25, lapTimeSeconds: 86.1, stressScore: 92, rearTyreTempC: 110 },
  
  // Max Verstappen (Calm, good pace)
  { id: 'lt4', driverId: 'd1', lapNumber: 14, lapTimeSeconds: 83.2, stressScore: 42, rearTyreTempC: 98 },
  { id: 'lt5', driverId: 'd1', lapNumber: 15, lapTimeSeconds: 83.1, stressScore: 40, rearTyreTempC: 98, radioCallId: 'rc2' },
  
  // Lewis Hamilton (Tired)
  { id: 'lt6', driverId: 'd3', lapNumber: 41, lapTimeSeconds: 85.1, stressScore: 70, rearTyreTempC: 96 },
  { id: 'lt7', driverId: 'd3', lapNumber: 42, lapTimeSeconds: 86.5, stressScore: 82, rearTyreTempC: 95, radioCallId: 'rc3' },
  
  // Charles Leclerc (Concerned about engine)
  { id: 'lt8', driverId: 'd4', lapNumber: 10, lapTimeSeconds: 84.9, stressScore: 60, rearTyreTempC: 99, radioCallId: 'rc4' }
];

export const engineerInsights: EngineerInsight[] = [
  {
    id: 'ei1',
    driverId: 'd2',
    priority: 'HIGH',
    message: 'Driver reporting severe grip loss. Telemetry confirms 1.6s drop in lap time and elevated rear tyre temperatures (108°C). Consider moving to Plan B strategy.',
    relatedRadioCallId: 'rc1',
    timestamp: new Date(Date.now() - 14 * 60000).toISOString()
  },
  {
    id: 'ei2',
    driverId: 'd3',
    priority: 'MEDIUM',
    message: 'Driver fatigue detected. Lap times have dropped by 1.4s. Monitor braking points and steering inputs closely over the next 3 laps.',
    relatedRadioCallId: 'rc3',
    timestamp: new Date(Date.now() - 4 * 60000).toISOString()
  },
  {
    id: 'ei3',
    driverId: 'd4',
    priority: 'LOW',
    message: 'Engine clipping reported. Current temps are within safe operating window. Advise driver to use default mapping.',
    relatedRadioCallId: 'rc4',
    timestamp: new Date(Date.now() - 44 * 60000).toISOString()
  }
];