import React, { useState } from 'react';
import { MOCK_RADIO_CALLS } from '../data/mockData';
import { RadioCall } from '../types';
import { WaveformVisualizer } from '../components/common/WaveformVisualizer';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Radio, 
  Mic, 
  Sparkles, 
  Clock, 
  Tag, 
  Smile, 
  ShieldCheck, 
  Activity, 
  Volume2,
  FileText,
  Search
} from 'lucide-react';

export const RadioAnalysis: React.FC = () => {
  const [selectedCall, setSelectedCall] = useState<RadioCall>(MOCK_RADIO_CALLS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCalls = MOCK_RADIO_CALLS.filter(
    (call) =>
      call.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.detectedState.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-mono text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
          Radio Speech & Emotion Analysis
        </h2>
        <p className="text-xs text-slate-400 sm:text-sm">
          Acoustic stress detection, Speech-to-Text transcription, and key phrase phrase extraction
        </p>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (4 cols): Radio Transmissions List & Waveform Player */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Audio Waveform Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-rose-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-white uppercase">
                  SELECTED AUDIO STREAM
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400">
                LAP {selectedCall.lapNumber}
              </span>
            </div>

            <WaveformVisualizer
              duration={selectedCall.audioDuration}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              accentColor={selectedCall.detectedState === 'STRESSED' ? 'rose' : 'amber'}
            />

            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Channel: {selectedCall.channel}</span>
              <span>Bitrate: 8KHz Pit Stream</span>
            </div>
          </div>

          {/* Radio Timeline Call List */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-mono text-xs font-bold text-white uppercase">
                STINT TRANSMISSION LOG
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                {filteredCalls.length} CALLS
              </span>
            </div>

            {/* Search Filter */}
            <div className="relative my-3">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search transcript or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none font-sans"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filteredCalls.map((call) => {
                const isSelected = call.id === selectedCall.id;
                return (
                  <button
                    key={call.id}
                    onClick={() => {
                      setSelectedCall(call);
                      setIsPlaying(false);
                    }}
                    className={`flex w-full flex-col text-left rounded-lg border p-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500/50 bg-rose-500/10 shadow-sm'
                        : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>LAP {call.lapNumber}</span>
                        <span className="text-[10px] text-slate-500">• {call.timestamp}</span>
                      </div>
                      <StatusBadge state={call.detectedState} size="sm" />
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 italic">
                      &ldquo;{call.transcript}&rdquo;
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="text-blue-400">{call.topic}</span>
                      <span>Conf: {call.confidence}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Column (5 cols): Full Transcript & Sentence Level Emotional Highlights */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md h-full">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-rose-400" />
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    DEEP TRANSCRIPTION ANALYSIS
                  </h3>
                </div>
                <span className="font-mono text-xs text-slate-400">
                  {selectedCall.timestamp}
                </span>
              </div>

              {/* Speaker Header */}
              <div className="my-4 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/80 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-rose-500/20 font-mono text-xs font-bold text-rose-400">
                    #44
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {selectedCall.driverName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Primary Radio Channel ({selectedCall.sector})
                    </span>
                  </div>
                </div>
                <StatusBadge state={selectedCall.detectedState} size="sm" />
              </div>

              {/* Highlighted Transcript Body */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <div className="text-[10px] font-mono uppercase text-slate-500 mb-2">
                  Timestamped Sentence Stream
                </div>
                
                <div className="font-sans text-lg font-medium text-slate-100 leading-relaxed">
                  &ldquo;
                  {selectedCall.transcript.split(selectedCall.highlightedPhrase || '').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="mx-0.5 rounded bg-rose-500/30 px-1.5 py-0.5 text-rose-200 border border-rose-500/50 font-semibold underline decoration-rose-400">
                          {selectedCall.highlightedPhrase}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                  &rdquo;
                </div>

                <div className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Emotionally Relevant Acoustic Phrase</span>
                  </div>
                  <p className="text-slate-300">
                    Phrase &ldquo;{selectedCall.highlightedPhrase}&rdquo; correlated with pitch shift +24Hz and vocal tension spike index.
                  </p>
                </div>
              </div>

              {/* Extracted Key Phrases Chips */}
              <div className="mt-4">
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-2">
                  NLP Key Entities & Phrases:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCall.keyPhrases.map((phrase, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 font-mono text-xs text-slate-200"
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Sector Location */}
            <div className="mt-6 border-t border-slate-800 pt-3 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Track Location: {selectedCall.sector}</span>
              <span>Audio Pitch Variance: High</span>
            </div>
          </div>
        </div>

        {/* Right Column (3 cols): Detected State, Confidence & Insights */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-md space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                AUDIO CLASSIFICATION
              </h3>
            </div>

            {/* Detected State Card */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Primary Classification
              </span>
              <div className="mt-1">
                <StatusBadge state={selectedCall.detectedState} size="lg" />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-300 border-t border-slate-800 pt-2">
                <span>Model Confidence:</span>
                <span className="font-bold text-emerald-400">{selectedCall.confidence}%</span>
              </div>
            </div>

            {/* Topic Badge */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Detected Conversation Topic
              </span>
              <div className="mt-1 font-mono text-sm font-bold text-blue-400">
                {selectedCall.topic}
              </div>
            </div>

            {/* Sentiment */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Vocal Sentiment
              </span>
              <div className="mt-1 font-semibold text-slate-200 text-sm">
                {selectedCall.sentiment}
              </div>
            </div>

            {/* Telemetry Impact Summary */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs">
              <span className="font-mono text-[10px] uppercase font-semibold text-amber-400 block mb-1">
                Telemetry Context Correlation
              </span>
              <p className="text-slate-300 leading-relaxed">
                Radio call at lap {selectedCall.lapNumber} coincided with +0.5s lap time loss in {selectedCall.sector}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
