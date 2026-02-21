import { useState, useEffect, useRef } from 'react';
import type { DayPrayerTimes } from '../lib/storage';

export type AppPhase = 'suhoor' | 'fasting' | 'postSunset' | 'night';

export interface PhaseState {
  phase: AppPhase;
  sunProgress: number;      // 0-1 during fasting, -1 otherwise
  minutesToIftar: number;
  minutesToFajr: number;
}

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function usePhase(prayerTimes: DayPrayerTimes | undefined): PhaseState {
  const [state, setState] = useState<PhaseState>({
    phase: 'night',
    sunProgress: -1,
    minutesToIftar: 0,
    minutesToFajr: 0,
  });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!prayerTimes) return;

    const imsakMin = timeToMinutes(prayerTimes.imsak);
    const fajrMin = timeToMinutes(prayerTimes.fajr);
    const maghribMin = timeToMinutes(prayerTimes.maghrib);
    const ishaMin = timeToMinutes(prayerTimes.isha);
    const suhoorStart = Math.max(imsakMin - 60, 0);
    const postSunsetEnd = ishaMin + 120;

    function update() {
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

      let phase: AppPhase;
      let sunProgress = -1;

      if (currentMin >= suhoorStart && currentMin < fajrMin) {
        phase = 'suhoor';
      } else if (currentMin >= fajrMin && currentMin <= maghribMin) {
        phase = 'fasting';
        sunProgress = Math.max(0, Math.min(1, (currentMin - fajrMin) / (maghribMin - fajrMin)));
      } else if (currentMin > maghribMin && currentMin <= postSunsetEnd) {
        phase = 'postSunset';
      } else {
        phase = 'night';
      }

      setState({
        phase,
        sunProgress,
        minutesToIftar: Math.max(0, maghribMin - currentMin),
        minutesToFajr: Math.max(0, fajrMin - currentMin),
      });

      rafRef.current = requestAnimationFrame(update);
    }

    update();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prayerTimes]);

  return state;
}

// Maps PhaseState back to the numeric convention used by sky.ts and colors.ts
export function useSunProgress(phaseState: PhaseState): number {
  switch (phaseState.phase) {
    case 'suhoor': return -1;
    case 'fasting': return phaseState.sunProgress;
    case 'postSunset': return 2;
    case 'night': return 3;
  }
}
