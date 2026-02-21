import { useLocation } from './hooks/useLocation';
import { usePrayerTimes } from './hooks/usePrayerTimes';
import { usePhase, useSunProgress } from './hooks/usePhase';
import { getRamadanDay } from './lib/ramadan';
import { SkyBackground } from './components/SkyBackground';
import { Header } from './components/Header';
import { PhaseView } from './components/PhaseView';
import { LocationPrompt } from './components/LocationPrompt';

function App() {
  const { lat, lng, loading: locLoading, error: locError, needsPermission, requestLocation } = useLocation();
  const { times, loading: timesLoading, error: timesError } = usePrayerTimes(
    lat,
    lng,
    !locLoading && !needsPermission && lat !== 0
  );

  const loading = locLoading || timesLoading;
  const error = timesError;

  const today = getRamadanDay(new Date());
  const todayTimes = times[today];
  const phaseState = usePhase(todayTimes);
  const numericSunProgress = useSunProgress(phaseState);

  return (
    <>
      <SkyBackground sunProgress={numericSunProgress} />

      <div className="relative z-10 w-full max-w-[400px] mx-auto px-5 py-6 min-h-full flex flex-col">
        <Header locationError={!needsPermission ? locError : null} />

        {needsPermission ? (
          <LocationPrompt onRequest={requestLocation} error={locError} />
        ) : loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-4 h-4 border-[1.5px] border-white/[0.06] border-t-white/30 rounded-full animate-spin" />
              <p className="text-[9px] text-white/15 tracking-wider">
                {locLoading ? 'Getting location...' : 'Loading prayer times...'}
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-[10px] text-red-400/50 text-center px-4">{error}</p>
          </div>
        ) : todayTimes ? (
          <PhaseView
            phase={phaseState.phase}
            sunProgress={phaseState.sunProgress}
            numericSunProgress={numericSunProgress}
            prayerTimes={todayTimes}
            minutesToIftar={phaseState.minutesToIftar}
            minutesToFajr={phaseState.minutesToFajr}
          />
        ) : null}
      </div>
    </>
  );
}

export default App;
