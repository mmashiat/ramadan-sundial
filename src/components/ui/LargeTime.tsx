interface LargeTimeProps {
  time: string;      // e.g. "7:04" or "3h 47m"
  suffix?: string;   // e.g. "AM", "PM"
  className?: string;
}

export function LargeTime({ time, suffix, className = '' }: LargeTimeProps) {
  return (
    <div className={`flex items-baseline gap-0.5 ${className}`}>
      <span className="text-[40px] font-light text-white/90 tabular-nums leading-none tracking-tight">
        {time}
      </span>
      {suffix && (
        <span className="text-[16px] font-medium text-white/60 uppercase tracking-wide">
          {suffix}
        </span>
      )}
    </div>
  );
}
