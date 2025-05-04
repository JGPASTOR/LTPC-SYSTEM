import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, User } from "lucide-react";

export interface TrainingBatch {
  id: string;
  title: string;
  startDate: string;
  trainer: string;
  enrolled: number;
  capacity: number;
}

interface UpcomingBatchesProps {
  batches: TrainingBatch[];
}

export function UpcomingBatches({ batches }: UpcomingBatchesProps) {
  return (
    <Card className="card">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle>Upcoming Training Batches</CardTitle>
          <Button variant="link" className="text-primary p-0">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ul className="divide-y divide-gray-200">
          {batches.map((batch) => (
            <li key={batch.id} className="py-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium">{batch.title}</h4>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Starts: {batch.startDate}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <User className="h-4 w-4 mr-1" />
                  <span>Trainer: {batch.trainer}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{batch.enrolled}/{batch.capacity}</div>
                <div className="text-xs text-muted-foreground">Enrollees</div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
