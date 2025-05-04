import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCheck, Wallet, BookOpen, GraduationCap, UserPlus } from "lucide-react";

export interface Activity {
  id: string;
  type: "enrollment" | "payment" | "course" | "assessment" | "trainer";
  content: string;
  timestamp: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  // Get icon based on activity type
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "enrollment":
        return <UserCheck className="h-4 w-4" />;
      case "payment":
        return <Wallet className="h-4 w-4" />;
      case "course":
        return <BookOpen className="h-4 w-4" />;
      case "assessment":
        return <GraduationCap className="h-4 w-4" />;
      case "trainer":
        return <UserPlus className="h-4 w-4" />;
    }
  };

  // Get background color based on activity type
  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "enrollment":
        return "bg-secondary";
      case "payment":
        return "bg-success";
      case "course":
        return "bg-primary";
      case "assessment":
        return "bg-accent";
      case "trainer":
        return "bg-info";
    }
  };

  return (
    <Card className="card">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle>Recent Activities</CardTitle>
          <Button variant="link" className="text-primary p-0">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ul className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity.id} className="py-3">
              <div className="flex items-start">
                <Avatar className={`h-8 w-8 ${getActivityColor(activity.type)} text-white mr-3`}>
                  <AvatarFallback>
                    {getActivityIcon(activity.type)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: activity.content }} />
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
