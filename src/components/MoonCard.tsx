import { WeatherCard } from './ui/WeatherCard';
import { CardHeader } from './ui/CardHeader';
import { InfoRow } from './ui/InfoRow';
import { getMoonPhase } from '../lib/moon';

interface MoonCardProps {
  ramadanDay: number;
}

function getIllumination(day: number): number {
  return Math.round(Math.sin((day / 30) * Math.PI) * 100);
}

function getDaysUntilFullMoon(day: number): number {
  if (day <= 15) return 15 - day;
  return 30 - day + 15;
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function MoonCard({ ramadanDay }: MoonCardProps) {
  const { name: phaseName, image: moonImage } = getMoonPhase(ramadanDay);
  const illumination = getIllumination(ramadanDay);
  const daysToFull = getDaysUntilFullMoon(ramadanDay);

  return (
    <WeatherCard padding="default" className="mb-3 animate-phase-enter">
      <CardHeader icon={<MoonIcon />} label={phaseName} />

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <InfoRow label="Illumination" value={`${illumination}%`} />
          <InfoRow
            label="Next Full Moon"
            value={daysToFull === 0 ? 'Tonight' : `${daysToFull} days`}
            isLast
          />
        </div>

        <div className="w-[72px] h-[72px] rounded-full overflow-hidden flex-shrink-0">
          <img
            src={moonImage}
            alt={phaseName}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.7) contrast(1.1)' }}
          />
        </div>
      </div>
    </WeatherCard>
  );
}
