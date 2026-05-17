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
  badge,
  badgeCls,
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
      </div>
      <div className="text-3xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs text-gray-600 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
