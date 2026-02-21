import { useState, useCallback } from 'react';
import { getRamadanDay, RAMADAN_DAYS } from '../lib/ramadan';
import { getFastingStatus, setFastingStatus, type FastingStatus } from '../lib/storage';
import type { AppPhase } from '../hooks/usePhase';
import type { DayPrayerTimes } from '../lib/storage';
import { Sundial } from './Sundial';
import { IntentionPrompt } from './IntentionPrompt';
import { ReflectionPrompt } from './ReflectionPrompt';
import { FastingLog } from './FastingLog';
import { IftarCountdown } from './IftarCountdown';
import { MoonCard } from './MoonCard';
import { RamadanGrid } from './RamadanGrid';
import { EidCountdown } from './EidCountdown';

interface PhaseViewProps {
  phase: AppPhase;
  sunProgress: number;
  numericSunProgress: number;
  prayerTimes: DayPrayerTimes;
  minutesToIftar: number;
  minutesToFajr: number;
}

export function PhaseView({
  phase,
  sunProgress,
  numericSunProgress,
  prayerTimes,
  minutesToIftar,
  minutesToFajr,
}: PhaseViewProps) {
  const today = getRamadanDay(new Date());
  const clampedToday = Math.max(1, Math.min(today, RAMADAN_DAYS));

  const [fastingStatus, setFastingStatusState] = useState<FastingStatus>(() =>
    getFastingStatus(clampedToday)
  );

  const handleRecord = useCallback((status: 'fasted' | 'missed') => {
    setFastingStatus(clampedToday, status);
    setFastingStatusState(status);
  }, [clampedToday]);

  return (
    <div key={phase} className="animate-phase-enter">
      {/* Sundial is always visible */}
      <Sundial
        phase={phase}
        sunProgress={sunProgress}
        prayerTimes={prayerTimes}
      />

      {/* Phase-specific content */}
      {phase === 'suhoor' && (
        <>
          <div className="mb-3 text-center">
            <p className="text-[11px] text-white/25 tracking-[0.1em] uppercase">
              {formatMinutes(minutesToFajr)} until Fajr
            </p>
          </div>
          <IntentionPrompt day={clampedToday} />
          <MoonCard ramadanDay={clampedToday} />
        </>
      )}

      {phase === 'fasting' && (
        <>
          <IftarCountdown minutesToIftar={minutesToIftar} day={clampedToday} />
        </>
      )}

      {phase === 'postSunset' && (
        <>
          <FastingLog
            day={clampedToday}
            currentStatus={fastingStatus}
            onRecord={handleRecord}
          />
          <ReflectionPrompt day={clampedToday} />
          <RamadanGrid sunProgress={numericSunProgress} />
        </>
      )}

      {phase === 'night' && (
        <>
          <MoonCard ramadanDay={clampedToday} />
          <RamadanGrid sunProgress={numericSunProgress} />
          <EidCountdown />
        </>
      )}
    </div>
  );
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
