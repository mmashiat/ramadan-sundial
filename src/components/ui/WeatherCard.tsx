interface WeatherCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'compact' | 'default' | 'spacious';
}

const paddingMap = {
  compact: 'px-4 py-3',
  default: 'px-5 py-5',
  spacious: 'px-6 py-6',
};

export function WeatherCard({ children, className = '', padding = 'default' }: WeatherCardProps) {
  return (
    <div
      className={`rounded-[20px] ${paddingMap[padding]} ${className}`}
      style={{
        background: 'rgb(40, 50, 68)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 4px 24px rgba(0, 0, 0, 0.3)',
      }}
    >
      {children}
    </div>
  );
}
