import { useState, useEffect } from 'react';
import { WeatherCard } from './ui/WeatherCard';
import { CardHeader } from './ui/CardHeader';
import { GlassTextarea } from './ui/GlassTextarea';
import { GlassButton } from './ui/GlassButton';
import { getDayJournal, setIntention } from '../lib/storage';

interface IntentionPromptProps {
  day: number;
}

function CrescentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function IntentionPrompt({ day }: IntentionPromptProps) {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const journal = getDayJournal(day);
    if (journal.intention) {
      setText(journal.intention);
      setSaved(true);
    }
  }, [day]);

  const handleSave = () => {
    if (text.trim()) {
      setIntention(day, text.trim());
      setSaved(true);
    }
  };

  return (
    <WeatherCard padding="default" className="mb-3 animate-phase-enter">
      <CardHeader icon={<CrescentIcon />} label="Daily Intention" />

      <p className="text-[12px] text-white/35 mb-3 leading-relaxed">
        What is your focus for today's fast?
      </p>

      <GlassTextarea
        value={text}
        onChange={(v) => { setText(v); setSaved(false); }}
        placeholder="Set your intention for the day..."
        maxLength={200}
        rows={3}
      />

      <div className="flex items-center justify-between mt-3">
        {saved ? (
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgb(16, 185, 129)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[11px] text-emerald-400/60">Saved</span>
          </div>
        ) : (
          <span />
        )}
        {!saved && text.trim() && (
          <GlassButton onClick={handleSave} variant="success" className="px-5">
            Save
          </GlassButton>
        )}
      </div>
    </WeatherCard>
  );
}
