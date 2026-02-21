interface CardHeaderProps {
  icon: React.ReactNode;
  label: string;
}

export function CardHeader({ icon, label }: CardHeaderProps) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <span className="text-white/50 w-4 h-4 flex items-center justify-center">
        {icon}
      </span>
      <span className="text-[11px] text-white/50 font-medium tracking-[0.15em] uppercase">
        {label}
      </span>
    </div>
  );
}
