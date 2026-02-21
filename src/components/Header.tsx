import { RAMADAN_YEAR_AH } from '../lib/ramadan';

interface HeaderProps {
  locationError?: string | null;
}

export function Header({ locationError }: HeaderProps) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="text-center mb-5 pb-4">
      <h1 className="text-[17px] font-medium text-white/90 tracking-wide">
        {dateStr}
      </h1>
      <p className="text-[10px] text-white/30 mt-1 tracking-[0.2em] uppercase">
        Ramadan {RAMADAN_YEAR_AH}
      </p>

      {locationError && (
        <p className="text-[8px] text-amber-500/40 mt-2">{locationError}</p>
      )}
    </div>
  );
}
