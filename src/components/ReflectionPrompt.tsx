import { useState, useEffect } from 'react';
import { WeatherCard } from './ui/WeatherCard';
import { CardHeader } from './ui/CardHeader';
import { GlassTextarea } from './ui/GlassTextarea';
import { GlassButton } from './ui/GlassButton';
import { getDayJournal, setReflection } from '../lib/storage';

interface ReflectionPromptProps {
  day: number;
}

function ReflectIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export function ReflectionPrompt({ day }: ReflectionPromptProps) {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [intention, setIntentionText] = useState('');

  useEffect(() => {
    const journal = getDayJournal(day);
    if (journal.reflection) {
      setText(journal.reflection);
      setSaved(true);
    }
    if (journal.intention) {
      setIntentionText(journal.intention);
    }
  }, [day]);

  const handleSave = () => {
    if (text.trim()) {
      setReflection(day, text.trim());
      setSaved(true);
    }
  };

  return (
    <WeatherCard padding="default" className="mb-3 animate-phase-enter">
      <CardHeader icon={<ReflectIcon />} label="Evening Reflection" />

      {intention && (
        <div className="mb-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-[9px] text-white/25 uppercase tracking-[0.1em] mb-1">Today's Intention</p>
          <p className="text-[12px] text-white/50 leading-relaxed italic">"{intention}"</p>
        </div>
      )}

      <p className="text-[12px] text-white/35 mb-3 leading-relaxed">
        How was your day?
      </p>

      <GlassTextarea
        value={text}
        onChange={(v) => { setText(v); setSaved(false); }}
        placeholder="Share a reflection from today..."
        maxLength={300}
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
