interface InfoRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isLast?: boolean;
}

export function InfoRow({ label, value, icon, isLast = false }: InfoRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 ${
        isLast ? '' : 'border-b border-white/[0.06]'
      }`}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-white/40 w-4 h-4 flex items-center justify-center">
            {icon}
          </span>
        )}
        <span className="text-[13px] text-white/50 font-medium">{label}</span>
      </div>
      <span className="text-[13px] text-white/80">{value}</span>
    </div>
  );
}
