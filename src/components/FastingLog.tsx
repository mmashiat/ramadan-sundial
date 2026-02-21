import { WeatherCard } from './ui/WeatherCard';
import { CardHeader } from './ui/CardHeader';
import { GlassButton } from './ui/GlassButton';
import type { FastingStatus } from '../lib/storage';

interface FastingLogProps {
  day: number;
  currentStatus: FastingStatus;
  onRecord: (status: 'fasted' | 'missed') => void;
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function FastingLog({ day, currentStatus, onRecord }: FastingLogProps) {
  const isLogged = currentStatus !== null;

  return (
    <WeatherCard padding="default" className="mb-3 animate-phase-enter">
      <CardHeader icon={<CheckIcon />} label="Fasting Log" />

      <p className="text-[14px] text-white/80 font-medium mb-1">
        Day {day}
      </p>

      {isLogged ? (
        <div className="mt-2">
          <p className="text-[12px] text-white/40 mb-3">
            Marked as{' '}
            <span className={currentStatus === 'fasted' ? 'text-emerald-400/70' : 'text-red-400/70'}>
              {currentStatus === 'fasted' ? 'completed' : 'missed'}
            </span>
          </p>
          <div className="flex gap-2">
            <GlassButton
              onClick={() => onRecord('fasted')}
              variant={currentStatus === 'fasted' ? 'success' : 'default'}
              className="flex-1"
            >
              Completed
            </GlassButton>
            <GlassButton
              onClick={() => onRecord('missed')}
              variant={currentStatus === 'missed' ? 'danger' : 'default'}
              className="flex-1"
            >
              Missed
            </GlassButton>
          </div>
        </div>
      ) : (
        <>
          <p className="text-[12px] text-white/35 mb-3">
            Did you complete your fast today?
          </p>
          <div className="flex gap-2">
            <GlassButton onClick={() => onRecord('fasted')} variant="success" className="flex-1">
              Completed
            </GlassButton>
            <GlassButton onClick={() => onRecord('missed')} variant="danger" className="flex-1">
              Missed
            </GlassButton>
          </div>
        </>
      )}
    </WeatherCard>
  );
}
