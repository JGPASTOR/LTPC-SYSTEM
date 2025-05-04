import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Building, Eye, UserCheck } from "lucide-react";

export interface EmploymentReferral {
  id: string;
  traineeName: string;
  course: string;
  completionDate: string;
  employer: string;
  position: string;
  status: "Pending" | "Endorsed" | "Hired" | "Declined";
}

interface EmploymentReferralsProps {
  referrals: EmploymentReferral[];
  onView: (id: string) => void;
  onEndorse: (id: string) => void;
}

export function EmploymentReferrals({ referrals, onView, onEndorse }: EmploymentReferralsProps) {
  // Function to determine badge color based on status
  const getStatusBadge = (status: EmploymentReferral["status"]) => {
    switch (status) {
      case "Pending":
        return <Badge variant="outline">Pending</Badge>;
      case "Endorsed":
        return <Badge variant="secondary">Endorsed</Badge>;
      case "Hired":
        return <Badge className="bg-green-500 hover:bg-green-600">Hired</Badge>;
      case "Declined":
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Employment Referrals</CardTitle>
          <CardDescription>
            Recent graduates ready for employment endorsement
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {referrals.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No employment referrals available
            </div>
          ) : (
            referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">{referral.traineeName}</h4>
                    {getStatusBadge(referral.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{referral.course}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="h-3.5 w-3.5" />
                    <span>
                      {referral.employer} - {referral.position}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => onView(referral.id)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  {referral.status === "Pending" && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => onEndorse(referral.id)}
                    >
                      Endorse
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}