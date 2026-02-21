import { WeatherCard } from './ui/WeatherCard';
import { LargeTime } from './ui/LargeTime';
import { getDayJournal } from '../lib/storage';

interface IftarCountdownProps {
  minutesToIftar: number;
  day: number;
}

export function IftarCountdown({ minutesToIftar, day }: IftarCountdownProps) {
  const hours = Math.floor(minutesToIftar / 60);
  const mins = Math.round(minutesToIftar % 60);

  let timeStr: string;
  if (hours > 0) {
    timeStr = `${hours}h ${mins}m`;
  } else {
    timeStr = `${mins}m`;
  }

  const journal = getDayJournal(day);

  return (
    <WeatherCard padding="compact" className="mb-3">
      <div className="flex items-center justify-between">
        <div>
          <LargeTime time={timeStr} className="mb-0.5" />
          <p className="text-[11px] text-white/30 tracking-[0.1em] uppercase">until Iftar</p>
        </div>
      </div>

      {journal.intention && (
        <div className="mt-3 pt-3 border-t border-white/[0.06]">
          <p className="text-[9px] text-white/20 uppercase tracking-[0.1em] mb-1">Today's Intention</p>
          <p className="text-[11px] text-white/40 italic leading-relaxed">"{journal.intention}"</p>
        </div>
      )}
    </WeatherCard>
  );
}
