import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  changeValue: number;
  changeLabel?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  changeValue,
  changeLabel = "Since last month"
}: StatsCardProps) {
  const isPositive = changeValue >= 0;
  
  return (
    <Card className="card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          <div className={`w-12 h-12 rounded-full ${iconBgColor} bg-opacity-10 flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <span className={`${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {isPositive ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(changeValue)}%
          </span>
          <span className="ml-2 text-muted-foreground">{changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
