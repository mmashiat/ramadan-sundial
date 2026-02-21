const STORAGE_KEY = 'ramadan-sundial-1447';

export type FastingStatus = 'fasted' | 'missed' | null;

interface FastingLog {
  [day: number]: FastingStatus;
}

export function getFastingLog(): FastingLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setFastingStatus(day: number, status: FastingStatus): void {
  const log = getFastingLog();
  if (status === null) {
    delete log[day];
  } else {
    log[day] = status;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

export function getFastingStatus(day: number): FastingStatus {
  return getFastingLog()[day] ?? null;
}

// Cache prayer times
const PRAYER_CACHE_KEY = 'ramadan-prayer-times-1447-v2';

export interface DayPrayerTimes {
  fajr: string;
  imsak: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export function getCachedPrayerTimes(): Record<number, DayPrayerTimes> | null {
  try {
    const raw = localStorage.getItem(PRAYER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function cachePrayerTimes(times: Record<number, DayPrayerTimes>): void {
  localStorage.setItem(PRAYER_CACHE_KEY, JSON.stringify(times));
}

// Cache location
const LOCATION_KEY = 'ramadan-location';

export function getCachedLocation(): { lat: number; lng: number } | null {
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function cacheLocation(lat: number, lng: number): void {
  localStorage.setItem(LOCATION_KEY, JSON.stringify({ lat, lng }));
}

// Journal — daily intentions and reflections
const JOURNAL_KEY = 'ramadan-sundial-journal-1447';

export interface DayJournal {
  intention?: string;
  reflection?: string;
}

export function getJournal(): Record<number, DayJournal> {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getDayJournal(day: number): DayJournal {
  return getJournal()[day] ?? {};
}

export function setIntention(day: number, text: string): void {
  const journal = getJournal();
  journal[day] = { ...journal[day], intention: text };
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
}

export function setReflection(day: number, text: string): void {
  const journal = getJournal();
  journal[day] = { ...journal[day], reflection: text };
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
}
