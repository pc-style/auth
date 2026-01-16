interface StatsCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

/**
 * Stats card component for displaying metrics
 */
export function StatsCard({ label, value, icon, trend }: StatsCardProps) {
    return (
        <article className="bg-black/50 backdrop-blur-md border border-[#ff00ff]/20 p-6 relative overflow-hidden group hover:border-[#ff00ff]/40 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff00ff]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500 font-mono text-xs uppercase tracking-wider">
                        {label}
                    </span>
                    <div className="text-[#ff00ff]/60" aria-hidden="true">
                        {icon}
                    </div>
                </div>

                <p className="text-3xl font-mono font-bold text-white mb-1">
                    {typeof value === "number" ? value.toLocaleString() : value}
                </p>

                {trend && (
                    <p
                        className={`font-mono text-xs ${trend.isPositive ? "text-green-400" : "text-red-400"
                            }`}
                    >
                        {trend.isPositive ? "+" : ""}
                        {trend.value}% from last week
                    </p>
                )}
            </div>
        </article>
    );
}
