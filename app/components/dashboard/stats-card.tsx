import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
}: StatsCardProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-100">{value}</h3>
            {trend && (
              <p
                className={`text-xs mt-2 ${
                  trendUp ? "text-green-400" : "text-red-400"
                }`}
              >
                {trendUp ? "↑" : "↓"} {trend}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
