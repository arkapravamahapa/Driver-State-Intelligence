import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { MOCK_DRIVERS, MOCK_RADIO_CALLS, MOCK_ENGINEER_INSIGHTS } from './data/mockData';
import { DriverProfile } from './types';

// Page Imports
import { Overview } from './pages/Overview';
import { RadioAnalysis } from './pages/RadioAnalysis';
import { DriverState } from './pages/DriverState';
import { Performance } from './pages/Performance';
import { Correlation } from './pages/Correlation';
import { EngineerInsights } from './pages/EngineerInsights';
import { SessionHistory } from './pages/SessionHistory';

export default function App() {
  const [currentDriver, setCurrentDriver] = useState<DriverProfile>(MOCK_DRIVERS[0]);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const latestRadio = MOCK_RADIO_CALLS[0];
  const topInsight = MOCK_ENGINEER_INSIGHTS[0];

  return (
    <div className="flex h-screen flex-col bg-slate-950 font-sans text-slate-100 selection:bg-rose-500 selection:text-white antialiased overflow-hidden">
      {/* Header */}
      <Header
        drivers={MOCK_DRIVERS}
        currentDriver={currentDriver}
        onSelectDriver={(drv) => setCurrentDriver(drv)}
        unreadCount={2}
      />

      {/* Body Area */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          highPriorityCount={1}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full min-h-0 scroll-smooth">
          {activeTab === 'overview' && (
            <Overview
              driver={currentDriver}
              latestRadio={latestRadio}
              topInsight={topInsight}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'radio' && <RadioAnalysis />}

          {activeTab === 'state' && <DriverState driver={currentDriver} />}

          {activeTab === 'performance' && <Performance />}

          {activeTab === 'correlation' && <Correlation />}

          {activeTab === 'insights' && <EngineerInsights />}

          {activeTab === 'history' && <SessionHistory />}
        </main>
      </div>
    </div>
  );
}
