import { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EnrollmentData {
  name: string;
  enrollments: number;
}

interface EnrollmentChartProps {
  monthlyData: EnrollmentData[];
  quarterlyData: EnrollmentData[];
  yearlyData: EnrollmentData[];
}

type Period = "monthly" | "quarterly" | "yearly";

export function EnrollmentChart({ monthlyData, quarterlyData, yearlyData }: EnrollmentChartProps) {
  const [activePeriod, setActivePeriod] = useState<Period>("monthly");
  
  // Determine which dataset to use based on active period
  const chartData = {
    monthly: monthlyData,
    quarterly: quarterlyData,
    yearly: yearlyData
  }[activePeriod];
  
  return (
    <Card className="card col-span-2">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>Enrollment Trends</CardTitle>
          <div className="flex">
            <Button
              variant={activePeriod === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setActivePeriod("monthly")}
              className="text-sm"
            >
              Monthly
            </Button>
            <Button
              variant={activePeriod === "quarterly" ? "default" : "outline"}
              size="sm"
              onClick={() => setActivePeriod("quarterly")}
              className="ml-2 text-sm"
            >
              Quarterly
            </Button>
            <Button
              variant={activePeriod === "yearly" ? "default" : "outline"}
              size="sm"
              onClick={() => setActivePeriod("yearly")}
              className="ml-2 text-sm"
            >
              Yearly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="enrollments" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
