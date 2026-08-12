import { lapTelemetries, radioCalls } from '../data/mockData';

export const correlationService = {
  getCorrelationData: (driverId: string) => {
    const driverTelemetry = lapTelemetries.filter(t => t.driverId === driverId);
    const driverRadio = radioCalls.filter(r => r.driverId === driverId);

    // Deterministic logic: Combine telemetry metrics with radio sentiment and state
    const correlation = driverTelemetry.map(lap => {
      const relatedCall = driverRadio.find(r => r.id === lap.radioCallId);
      
      return {
        lapNumber: lap.lapNumber,
        lapTimeSeconds: lap.lapTimeSeconds,
        stressScore: lap.stressScore,
        rearTyreTempC: lap.rearTyreTempC,
        driverState: relatedCall?.detectedState || 'CALM',
        sentiment: relatedCall?.sentiment || 'Neutral',
        topic: relatedCall?.topic || null,
        radioTranscript: relatedCall?.transcript || null
      };
    });

    return correlation;
  }
};