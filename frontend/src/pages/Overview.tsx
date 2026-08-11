import React, { useState } from 'react';
import { DriverProfile, RadioCall, EngineerInsight } from '../types';
import { TopStatusRow } from '../components/dashboard/TopStatusRow';
import { CurrentRadioPanel } from '../components/dashboard/CurrentRadioPanel';
import { DriverStateCard } from '../components/dashboard/DriverStateCard';
import { StressTimeline } from '../components/dashboard/StressTimeline';
import { StressVsPerformanceChart } from '../components/dashboard/StressVsPerformanceChart';
import { OverviewEngineerInsightCard } from '../components/dashboard/OverviewEngineerInsightCard';

interface OverviewProps {
  driver: DriverProfile;
  latestRadio: RadioCall;
  topInsight: EngineerInsight;
  onNavigateTab: (tab: any) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  driver,
  latestRadio,
  topInsight,
  onNavigateTab,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div>
        <h2 className="font-mono text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
          Race Intelligence Overview
        </h2>
        <p className="text-xs text-slate-400 sm:text-sm">
          Real-time driver state, speech stress analysis, and lap telemetry performance monitoring
        </p>
      </div>

      {/* Top High-Level Status Row */}
      <TopStatusRow driver={driver} />

      {/* Grid: Current Radio Panel + Driver State Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CurrentRadioPanel
            radioCall={latestRadio}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
          />
        </div>

        <div>
          <DriverStateCard driver={driver} />
        </div>
      </div>

      {/* Stress Timeline Transition */}
      <StressTimeline />

      {/* Grid: Stress vs Performance Chart + Engineer Insight Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StressVsPerformanceChart />
        </div>

        <div>
          <OverviewEngineerInsightCard
            insight={topInsight}
            onAcknowledge={() => setAcknowledged(true)}
            onNavigateToInsights={() => onNavigateTab('insights')}
          />
        </div>
      </div>
    </div>
  );
};
