interface StatCardProps {
  label: string;
  value: number;
  trend?: string;
  trendUp?: boolean;
  badge?: string;
  badgeCls?: string;
  progress?: number;
  icon: React.ReactNode;
  iconBg: string;
}

export default function StatCard({
  label,
  value,
  trend,
  trendUp,
  badge,
  badgeCls,
  progress,
  icon,
  iconBg,
}: StatCardProps) {
  return (
    <div className="bg-[#13131f] border border-white/6 rounded-2xl p-4 hover:border-white/10 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
        {badge && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${badgeCls}`}>
            {badge}
          </span>
        )}
        {trend && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${trendUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs text-gray-600 uppercase tracking-wide">
        {label}
      </div>
      {progress !== undefined && (
        <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
