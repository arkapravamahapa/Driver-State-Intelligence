import React, { useState } from 'react';
import { 
  Radio, 
  Bell, 
  Settings, 
  ChevronDown, 
  Clock, 
  Activity, 
  AlertTriangle, 
  ShieldCheck,
  User,
  CheckCircle2
} from 'lucide-react';
import { DriverProfile } from '../../types';

interface HeaderProps {
  drivers: DriverProfile[];
  currentDriver: DriverProfile;
  onSelectDriver: (driver: DriverProfile) => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  drivers,
  currentDriver,
  onSelectDriver,
  unreadCount = 2,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDriverMenu, setShowDriverMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 md:px-6 backdrop-blur-md">
      {/* Left: Product Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-500/40 bg-gradient-to-br from-rose-500/20 to-slate-900 text-rose-400 shadow-md shadow-rose-950/30">
          <Activity className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-sm font-bold tracking-wider text-white uppercase md:text-base">
              Driver State Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-rose-400 border border-rose-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="hidden text-[11px] text-slate-400 sm:block">
            Pit-Wall Decision Support System • Race Engineering Telemetry
          </p>
        </div>
      </div>

      {/* Center: Session & Driver Selector */}
      <div className="hidden items-center gap-4 lg:flex">
        {/* Session Selector */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300">
          <Radio className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-medium text-white">{currentDriver.sessionName}</span>
        </div>

        {/* Lap Badge */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 font-mono text-xs text-slate-300">
          <span className="text-slate-500">LAP:</span>
          <span className="font-bold text-emerald-400">
            {currentDriver.currentLap}
          </span>
          <span className="text-slate-500">/ {currentDriver.totalLaps}</span>
        </div>

        {/* Driver Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDriverMenu(!showDriverMenu)}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-slate-600 cursor-pointer"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-rose-500/20 font-mono text-[11px] font-bold text-rose-400">
              #{currentDriver.carNumber}
            </div>
            <span>{currentDriver.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showDriverMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-800 bg-slate-900 py-1 shadow-xl z-50">
              <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                Select Telemetry Driver
              </div>
              {drivers.map((drv) => (
                <button
                  key={drv.id}
                  onClick={() => {
                    onSelectDriver(drv);
                    setShowDriverMenu(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-xs transition cursor-pointer ${
                    drv.id === currentDriver.id
                      ? 'bg-rose-500/10 text-rose-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500">#{drv.carNumber}</span>
                    <span>{drv.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{drv.teamName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Session Timer & Action Controls */}
      <div className="flex items-center gap-3">
        {/* Session Time */}
        <div className="hidden items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 font-mono text-xs text-slate-300 sm:flex">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>14:32:05</span>
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 transition cursor-pointer"
            title="Pit-Wall Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 font-mono text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-mono text-xs font-semibold text-white uppercase">
                  Engineers Alerts (2)
                </span>
                <span className="text-[10px] text-slate-500">Live Stream</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-2.5 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-rose-400">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>Lap 21 Stress Alert</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300">
                    Daniel Carter stress reached 87% following radio turn 7 report.
                  </p>
                  <span className="mt-1 block text-[10px] text-slate-500 font-mono">14:32:05</span>
                </div>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                    <Activity className="h-3.5 w-3.5 shrink-0" />
                    <span>Tyre Temp Threshold</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300">
                    Rear surface temperatures crossed 130°C in Sector 2.
                  </p>
                  <span className="mt-1 block text-[10px] text-slate-500 font-mono">14:30:40</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 transition cursor-pointer"
          title="Telemetry Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        {showSettings && (
          <div className="absolute right-4 top-16 w-72 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-2xl z-50">
            <h3 className="font-mono text-xs font-semibold text-white uppercase border-b border-slate-800 pb-2">
              System Configuration
            </h3>
            <div className="mt-3 space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Audio Waveform FFT</span>
                <span className="font-mono text-emerald-400">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Speech AI Confidence Threshold</span>
                <span className="font-mono text-slate-400">75%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Telemetry Refresh Rate</span>
                <span className="font-mono text-slate-400">100ms</span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                Driver State Intelligence v2.4 • Hackathon Prototype
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
