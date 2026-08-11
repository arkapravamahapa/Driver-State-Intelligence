import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Radio } from 'lucide-react';

interface WaveformVisualizerProps {
  duration?: number; // in seconds
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  accentColor?: 'rose' | 'amber' | 'emerald' | 'blue' | 'purple';
  barCount?: number;
  height?: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  duration = 4.8,
  isPlaying: externalIsPlaying,
  onTogglePlay,
  accentColor = 'rose',
  barCount = 42,
  height = 48,
}) => {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

  const togglePlay = () => {
    if (onTogglePlay) {
      onTogglePlay();
    } else {
      setInternalIsPlaying(!internalIsPlaying);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            if (externalIsPlaying === undefined) setInternalIsPlaying(false);
            return 0;
          }
          return Math.min(prev + 0.1, duration);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, externalIsPlaying]);

  // Generate deterministic bar heights representing vocal waveform
  const generateBarHeights = (count: number) => {
    const bars: number[] = [];
    for (let i = 0; i < count; i++) {
      // Sinusoidal & random variation mimicking voice radio audio
      const norm = i / count;
      const envelope = Math.sin(norm * Math.PI);
      const noise = (Math.sin(i * 1.7) * 0.4 + 0.6) * (Math.cos(i * 0.9) * 0.3 + 0.7);
      const val = Math.max(0.15, Math.min(1.0, envelope * noise + 0.15));
      bars.push(val);
    }
    return bars;
  };

  const barHeights = generateBarHeights(barCount);
  const progressRatio = duration > 0 ? currentTime / duration : 0;

  const colorMap = {
    rose: {
      barActive: 'bg-rose-500',
      barInactive: 'bg-slate-700/60',
      btn: 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30',
      glow: 'shadow-rose-500/20',
    },
    amber: {
      barActive: 'bg-amber-500',
      barInactive: 'bg-slate-700/60',
      btn: 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30',
      glow: 'shadow-amber-500/20',
    },
    emerald: {
      barActive: 'bg-emerald-500',
      barInactive: 'bg-slate-700/60',
      btn: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30',
      glow: 'shadow-emerald-500/20',
    },
    blue: {
      barActive: 'bg-blue-500',
      barInactive: 'bg-slate-700/60',
      btn: 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30',
      glow: 'shadow-blue-500/20',
    },
    purple: {
      barActive: 'bg-purple-500',
      barInactive: 'bg-slate-700/60',
      btn: 'bg-purple-500/20 text-purple-400 border-purple-500/40 hover:bg-purple-500/30',
      glow: 'shadow-purple-500/20',
    },
  }[accentColor];

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/80 p-3 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-all cursor-pointer ${colorMap.btn}`}
          title={isPlaying ? 'Pause Radio Audio' : 'Play Radio Audio'}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Waveform Bars Container */}
        <div
          className="relative flex flex-1 items-center gap-[3px] overflow-hidden py-1 cursor-pointer"
          style={{ height: `${height}px` }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickRatio = (e.clientX - rect.left) / rect.width;
            setCurrentTime(clickRatio * duration);
          }}
        >
          {barHeights.map((h, i) => {
            const barRatio = i / barCount;
            const isPassed = barRatio <= progressRatio;
            
            // Add subtle height modulation if currently playing
            const currentH = isPlaying && isPassed
              ? Math.min(1.0, h * (0.8 + Math.random() * 0.4))
              : h;

            return (
              <div
                key={i}
                className="flex flex-1 items-center justify-center h-full"
              >
                <div
                  className={`w-full rounded-full transition-all duration-150 ${
                    isPassed ? colorMap.barActive : colorMap.barInactive
                  }`}
                  style={{
                    height: `${Math.max(12, currentH * 100)}%`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Timer & Channel Info */}
        <div className="flex flex-col items-end shrink-0 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Radio className={`h-3.5 w-3.5 ${isPlaying ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>
              {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
            </span>
          </div>
          <span className="text-[10px] text-slate-500">8KHz PIT AUDIO</span>
        </div>
      </div>
    </div>
  );
};
