import React from 'react';
import { Info } from 'lucide-react';

interface DisclaimerBannerProps {
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ className = '' }) => {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3.5 py-2.5 text-xs text-slate-400 backdrop-blur-sm ${className}`}
    >
      <Info className="h-4 w-4 shrink-0 text-blue-400" />
      <p className="leading-normal">
        <span className="font-semibold text-slate-300">Engineering Note:</span>{' '}
        Correlation indicates an observed relationship between driver stress and telemetry metrics and does not establish direct causation.
      </p>
    </div>
  );
};
