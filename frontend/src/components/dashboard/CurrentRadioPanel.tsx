import React from 'react';
import { RadioCall } from '../../types';
import { WaveformVisualizer } from '../common/WaveformVisualizer';
import { StatusBadge } from '../common/StatusBadge';
import { Radio, Mic, Tag, Smile, ShieldCheck, Sparkles } from 'lucide-react';

interface CurrentRadioPanelProps {
  radioCall: RadioCall;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

export const CurrentRadioPanel: React.FC<CurrentRadioPanelProps> = ({
  radioCall,
  isPlaying,
  onTogglePlay,
}) => {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-rose-500/20 text-rose-400">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              LATEST RADIO TRANSMISSION
            </h3>
            <span className="text-[10px] text-slate-400">
              {radioCall.channel} • {radioCall.driverName} (#{radioCall.sector})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">
            LAP {radioCall.lapNumber}
          </span>
          <span className="text-slate-400">{radioCall.timestamp}</span>
        </div>
      </div>

      {/* Audio Waveform */}
      <div className="my-4">
        <WaveformVisualizer
          duration={radioCall.audioDuration}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          accentColor={radioCall.detectedState === 'STRESSED' ? 'rose' : 'amber'}
          height={52}
        />
      </div>

      {/* Transcript Block */}
      <div className="rounded-lg border border-slate-800/80 bg-slate-950/80 p-4">
        <div className="flex items-center gap-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          <Mic className="h-3 w-3 text-rose-400" />
          <span>Speech-to-Text Transcript</span>
        </div>

        <p className="font-sans text-base font-medium italic text-slate-100 leading-relaxed">
          &ldquo;{radioCall.transcript}&rdquo;
        </p>

        {radioCall.highlightedPhrase && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-mono text-[11px]">
              Flagged stress trigger: &ldquo;{radioCall.highlightedPhrase}&rdquo;
            </span>
          </div>
        )}
      </div>

      {/* Metadata Indicators Row */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-slate-800/80 pt-3 text-xs">
        {/* Topic */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <Tag className="h-3 w-3 text-blue-400" /> Topic
          </span>
          <span className="font-mono font-semibold text-blue-300">
            {radioCall.topic}
          </span>
        </div>

        {/* Sentiment */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <Smile className="h-3 w-3 text-amber-400" /> Sentiment
          </span>
          <span className="font-semibold text-slate-200">
            {radioCall.sentiment}
          </span>
        </div>

        {/* Detected State */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <Radio className="h-3 w-3 text-rose-400" /> Detected State
          </span>
          <div>
            <StatusBadge state={radioCall.detectedState} size="sm" />
          </div>
        </div>

        {/* Confidence */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-400" /> Confidence
          </span>
          <span className="font-mono font-bold text-emerald-400">
            {radioCall.confidence}%
          </span>
        </div>
      </div>
    </div>
  );
};
