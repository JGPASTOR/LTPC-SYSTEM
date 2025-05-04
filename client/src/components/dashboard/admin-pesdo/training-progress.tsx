import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface CourseProgress {
  id: string;
  name: string;
  trainer: string;
  enrollmentCount: number;
  capacity: number;
  startDate: string;
  endDate: string;
  completion: number;
  status: "Ongoing" | "Completed" | "Scheduled";
}

interface TrainingProgressProps {
  courses: CourseProgress[];
}

export function TrainingProgress({ courses }: TrainingProgressProps) {
  // Get status badge with appropriate color
  const getStatusBadge = (status: CourseProgress["status"]) => {
    switch (status) {
      case "Ongoing":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Ongoing</Badge>;
      case "Completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case "Scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Training Progress</CardTitle>
        <CardDescription>
          Current status of active training batches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {courses.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No active training batches available
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{course.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Trainer: {course.trainer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(course.status)}
                    <span className="text-sm font-medium">
                      {course.enrollmentCount}/{course.capacity}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>
                      {formatDate(course.startDate)} - {formatDate(course.endDate)}
                    </span>
                    <span>{course.completion}% Complete</span>
                  </div>
                  <Progress value={course.completion} className="h-2" />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}