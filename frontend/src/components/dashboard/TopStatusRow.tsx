import React from 'react';
import { DriverProfile } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { Activity, Flag, Clock, AlertTriangle, MessageSquare } from 'lucide-react';

interface TopStatusRowProps {
  driver: DriverProfile;
}

export const TopStatusRow: React.FC<TopStatusRowProps> = ({ driver }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {/* 1. Driver State */}
      <MetricCard
        title="Driver State"
        value={driver.currentState}
        subValue={`${driver.stateConfidence}% CONF`}
        icon={Activity}
        badge={<StatusBadge state={driver.currentState} size="sm" />}
        trend={driver.stateTrend === 'Increasing' ? 'up' : 'neutral'}
        trendText={`Trend: ${driver.stateTrend}`}
        statusColor="rose"
        accentBorder
      />

      {/* 2. Current Lap */}
      <MetricCard
        title="Current Lap"
        value={`${driver.currentLap} / ${driver.totalLaps}`}
        subValue="STINT 2"
        icon={Flag}
        statusColor="slate"
        trendText="31 Laps Remaining"
      />

      {/* 3. Lap Time */}
      <MetricCard
        title="Lap Time"
        value={driver.currentLapTime}
        subValue={driver.lastLapDelta}
        icon={Clock}
        trend="up"
        trendText="+1.8s vs lap 18 baseline"
        statusColor="amber"
      />

      {/* 4. Performance Risk */}
      <MetricCard
        title="Performance Risk"
        value={driver.performanceRisk}
        icon={AlertTriangle}
        badge={<StatusBadge risk={driver.performanceRisk} size="sm" />}
        trendText="Thermal Runway Detected"
        statusColor="amber"
        accentBorder
      />

      {/* 5. Current Topic */}
      <MetricCard
        title="Current Topic"
        value={driver.currentTopic}
        icon={MessageSquare}
        subValue="8KHz PIT VOICE"
        statusColor="blue"
        trendText="Sector 2 Focus"
      />
    </div>
  );
};
