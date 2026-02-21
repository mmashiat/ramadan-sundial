import { useState } from 'react';

interface GlassTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}

export function GlassTextarea({
  value,
  onChange,
  placeholder = '',
  maxLength = 200,
  rows = 3,
}: GlassTextareaProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-xl px-4 py-3 text-[13px] text-white/80 leading-relaxed resize-none outline-none transition-all duration-200"
        style={{
          background: focused ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.04)',
          border: focused
            ? '1px solid rgba(255, 255, 255, 0.15)'
            : '1px solid rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          fontFamily: 'inherit',
        }}
      />
      {maxLength && (
        <span className="absolute bottom-2 right-3 text-[9px] text-white/20 tabular-nums">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}
