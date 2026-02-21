import { useRef, useEffect, useState } from 'react';
import { WeatherCard } from './ui/WeatherCard';
import { CardHeader } from './ui/CardHeader';
import { LargeTime } from './ui/LargeTime';
import type { AppPhase } from '../hooks/usePhase';
import type { DayPrayerTimes } from '../lib/storage';

interface SundialProps {
  phase: AppPhase;
  sunProgress: number;
  prayerTimes: DayPrayerTimes;
}

function formatTime12(time24: string): { time: string; suffix: string } {
  const [h, m] = time24.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return { time: `${h12}:${m.toString().padStart(2, '0')}`, suffix };
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// Get point on the sinusoidal arc
// The arc spans from x=30 to x=290, horizon at y=130
// Peaks at y=20 (above horizon), dips to y=155 below horizon at edges
const CX = 160;
const HORIZON_Y = 130;
const ARC_LEFT = 30;
const ARC_RIGHT = 290;
const ARC_PEAK = 20;

function getArcPoint(t: number): { x: number; y: number } {
  // t: 0 = Fajr (left), 1 = Maghrib (right)
  const x = ARC_LEFT + (ARC_RIGHT - ARC_LEFT) * t;
  // Sinusoidal curve: peaks at t=0.5, at horizon at t=0 and t=1
  const y = HORIZON_Y - (HORIZON_Y - ARC_PEAK) * Math.sin(t * Math.PI);
  return { x, y };
}

// Build SVG path for the sinusoidal arc
function buildArcPath(): string {
  const points: string[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const { x, y } = getArcPoint(t);
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(' ');
}

// Build the below-horizon continuation (dips down from endpoints)
function buildBelowHorizonPath(): string {
  const points: string[] = [];
  const steps = 30;
  // Left dip: from t=-0.15 to t=0
  for (let i = 0; i <= steps; i++) {
    const t = -0.15 + (0.15 * i) / steps;
    const x = ARC_LEFT + (ARC_RIGHT - ARC_LEFT) * t;
    const y = HORIZON_Y - (HORIZON_Y - ARC_PEAK) * Math.sin(t * Math.PI);
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(' ');
}

function buildBelowHorizonPathRight(): string {
  const points: string[] = [];
  const steps = 30;
  // Right dip: from t=1 to t=1.15
  for (let i = 0; i <= steps; i++) {
    const t = 1 + (0.15 * i) / steps;
    const x = ARC_LEFT + (ARC_RIGHT - ARC_LEFT) * t;
    const y = HORIZON_Y - (HORIZON_Y - ARC_PEAK) * Math.sin(t * Math.PI);
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(' ');
}

const ARC_PATH = buildArcPath();
const BELOW_LEFT_PATH = buildBelowHorizonPath();
const BELOW_RIGHT_PATH = buildBelowHorizonPathRight();

function SunriseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v4M4.93 10.93l2.83 2.83M2 18h4M18 18h4M19.07 10.93l-2.83 2.83" />
      <path d="M17 18a5 5 0 0 0-10 0" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Sundial({ phase, sunProgress, prayerTimes }: SundialProps) {
  const arcRef = useRef<SVGPathElement>(null);
  const [arcLength, setArcLength] = useState(0);

  useEffect(() => {
    if (arcRef.current) {
      setArcLength(arcRef.current.getTotalLength());
    }
  }, []);

  const fajrMin = timeToMinutes(prayerTimes.fajr);
  const maghribMin = timeToMinutes(prayerTimes.maghrib);
  const span = maghribMin - fajrMin;

  // Prayer time fractional positions along the arc
  const sunriseT = (timeToMinutes(prayerTimes.sunrise) - fajrMin) / span;
  const dhuhrT = (timeToMinutes(prayerTimes.dhuhr) - fajrMin) / span;
  const asrT = (timeToMinutes(prayerTimes.asr) - fajrMin) / span;

  const sunrisePos = getArcPoint(sunriseT);
  const dhuhrPos = getArcPoint(dhuhrT);
  const asrPos = getArcPoint(asrT);

  // Sun/moon position
  let dotPos: { x: number; y: number };
  let showSun = false;
  let showMoon = false;

  if (phase === 'fasting') {
    dotPos = getArcPoint(sunProgress);
    showSun = true;
  } else if (phase === 'suhoor') {
    // Sun below horizon on the left
    const t = -0.08;
    dotPos = {
      x: ARC_LEFT + (ARC_RIGHT - ARC_LEFT) * t,
      y: HORIZON_Y - (HORIZON_Y - ARC_PEAK) * Math.sin(t * Math.PI),
    };
    showSun = true;
  } else {
    // postSunset or night — sun set on right, show moon
    const t = 1.08;
    dotPos = {
      x: ARC_LEFT + (ARC_RIGHT - ARC_LEFT) * t,
      y: HORIZON_Y - (HORIZON_Y - ARC_PEAK) * Math.sin(t * Math.PI),
    };
    showMoon = true;
  }

  // Determine header info
  const isDaytime = phase === 'fasting';
  const isSuhoor = phase === 'suhoor';

  let headerLabel: string;
  let headerTime: { time: string; suffix: string };

  if (isSuhoor) {
    headerLabel = 'SUNRISE';
    headerTime = formatTime12(prayerTimes.sunrise);
  } else if (isDaytime) {
    headerLabel = 'SUNSET';
    headerTime = formatTime12(prayerTimes.maghrib);
  } else {
    headerLabel = 'SUNSET';
    headerTime = formatTime12(prayerTimes.maghrib);
  }

  // Arc opacity based on phase
  const arcOpacity = phase === 'fasting' ? 0.2 : phase === 'suhoor' ? 0.12 : 0.08;
  const traveledOpacity = phase === 'fasting' ? 0.5 : 0;

  // Traveled arc dasharray
  const traveledDash = arcLength > 0 && phase === 'fasting'
    ? `${sunProgress * arcLength} ${arcLength}`
    : undefined;

  return (
    <WeatherCard padding="default" className="mb-3">
      <CardHeader
        icon={isDaytime || isSuhoor ? <SunriseIcon /> : <MoonIcon />}
        label={headerLabel}
      />

      <LargeTime time={headerTime.time} suffix={headerTime.suffix} className="mb-2" />

      <svg viewBox="0 0 320 175" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="sunGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
          <radialGradient id="sunGrad">
            <stop offset="0%" stopColor="rgb(250, 200, 60)" />
            <stop offset="100%" stopColor="rgb(230, 160, 40)" />
          </radialGradient>
        </defs>

        {/* Horizon line */}
        <line
          x1="10" y1={HORIZON_Y} x2="310" y2={HORIZON_Y}
          stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"
        />

        {/* Below-horizon arc extensions */}
        <path d={BELOW_LEFT_PATH} fill="none" stroke={`rgba(255,255,255,${arcOpacity * 0.5})`} strokeWidth="1.5" />
        <path d={BELOW_RIGHT_PATH} fill="none" stroke={`rgba(255,255,255,${arcOpacity * 0.5})`} strokeWidth="1.5" />

        {/* Full arc path (dim) */}
        <path
          ref={arcRef}
          d={ARC_PATH}
          fill="none"
          stroke={`rgba(255,255,255,${arcOpacity})`}
          strokeWidth="1.5"
        />

        {/* Traveled arc (bright, during fasting) */}
        {traveledDash && (
          <path
            d={ARC_PATH}
            fill="none"
            stroke={`rgba(255,255,255,${traveledOpacity})`}
            strokeWidth="2"
            strokeDasharray={traveledDash}
          />
        )}

        {/* Prayer time markers */}
        {phase === 'fasting' && (
          <>
            <PrayerMarker pos={sunrisePos} label="Sunrise" />
            <PrayerMarker pos={dhuhrPos} label="Dhuhr" />
            <PrayerMarker pos={asrPos} label="Asr" />
          </>
        )}

        {/* Sun element */}
        {showSun && (
          <g className={phase === 'suhoor' ? 'animate-sun-rise' : ''}>
            {/* Glow */}
            <circle
              cx={dotPos.x} cy={dotPos.y} r="14"
              fill="rgba(250, 200, 60, 0.15)"
              filter="url(#sunGlow)"
            />
            {/* Outlined sun dot (Apple Weather style) */}
            <circle
              cx={dotPos.x} cy={dotPos.y} r="6"
              fill="rgb(50, 55, 70)"
              stroke="rgba(250, 200, 60, 0.8)"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Moon element */}
        {showMoon && (
          <g>
            <circle
              cx={dotPos.x} cy={dotPos.y} r="6"
              fill="rgb(50, 55, 70)"
              stroke="rgba(200, 205, 220, 0.6)"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Fajr label (left) */}
        <text
          x={ARC_LEFT} y={HORIZON_Y + 16}
          fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="start" fontFamily="inherit"
        >
          {prayerTimes.fajr}
        </text>

        {/* Maghrib label (right) */}
        <text
          x={ARC_RIGHT} y={HORIZON_Y + 16}
          fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="end" fontFamily="inherit"
        >
          {prayerTimes.maghrib}
        </text>
      </svg>

      {/* Bottom info line */}
      {(phase === 'postSunset' || phase === 'night') && (
        <div className="mt-1">
          <span className="text-[12px] text-white/40">
            Sunset: {formatTime12(prayerTimes.maghrib).time}
            <span className="text-[10px] ml-0.5">{formatTime12(prayerTimes.maghrib).suffix}</span>
          </span>
        </div>
      )}
    </WeatherCard>
  );
}

function PrayerMarker({ pos, label }: { pos: { x: number; y: number }; label: string }) {
  // Small tick mark radiating outward from the arc
  const angle = Math.atan2(HORIZON_Y - pos.y, pos.x - CX);
  const tickLen = 6;
  const x2 = pos.x + Math.cos(angle + Math.PI / 2) * tickLen;
  const y2 = pos.y - Math.sin(angle + Math.PI / 2) * tickLen;

  return (
    <g>
      <line
        x1={pos.x} y1={pos.y} x2={x2} y2={y2}
        stroke="rgba(255,255,255,0.2)" strokeWidth="1"
      />
      <text
        x={x2} y={y2 - 4}
        fill="rgba(255,255,255,0.25)" fontSize="7" textAnchor="middle" fontFamily="inherit"
      >
        {label}
      </text>
    </g>
  );
}
