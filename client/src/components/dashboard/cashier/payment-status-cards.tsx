import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wallet, AlertCircle, CheckCircle, ArrowRight, Clock } from "lucide-react";

// Define our own type for cashier view
interface PaymentEnrollment {
  id: string;
  traineeName: string;
  traineeInitials: string;
  courseName: string;
  trainerName: string;
  payment: "Paid" | "Pending";
  amountDue: number;
}

interface PaymentStatusCardsProps {
  enrollments: PaymentEnrollment[];
  onView: (id: string) => void;
  onRecord: (id: string) => void;
}

export function PaymentStatusCards({ enrollments, onView, onRecord }: PaymentStatusCardsProps) {
  // Get payment status indicator
  const getPaymentIcon = (status: "Paid" | "Pending") => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Pending":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Get background color based on payment status
  const getCardClassName = (status: "Paid" | "Pending") => {
    switch (status) {
      case "Paid":
        return "border-green-200 bg-green-50";
      case "Pending":
        return "border-red-200 bg-red-50";
      default:
        return "";
    }
  };

  // Get payment badge
  const getPaymentBadge = (status: "Paid" | "Pending") => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>;
      case "Pending":
        return <Badge variant="destructive">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {enrollments.map((enrollment) => (
        <Card 
          key={enrollment.id} 
          className={`${getCardClassName(enrollment.payment)} transition-all hover:shadow-md`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-2">
                  <AvatarFallback>{enrollment.traineeInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{enrollment.traineeName}</h4>
                  <p className="text-sm text-muted-foreground">{enrollment.courseName}</p>
                </div>
              </div>
              {getPaymentBadge(enrollment.payment)}
            </div>
            
            <div className="space-y-2 mt-2">
              <div className="flex items-center text-sm">
                <span className="font-medium mr-2">Trainer:</span> 
                {enrollment.trainerName}
              </div>
              
              <div className="flex items-center text-sm">
                <span className="font-medium mr-2">Amount Due:</span> 
                ₱{enrollment.amountDue.toLocaleString()}
              </div>
              
              <div className="flex items-center text-sm">
                <span className="font-medium mr-2">Payment Status:</span>
                <div className="flex items-center">
                  {getPaymentIcon(enrollment.payment)}
                  <span className="ml-1">{enrollment.payment === "Paid" ? "Paid" : "Pending"}</span>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex justify-between border-t mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onView(enrollment.id)}
            >
              View Details
            </Button>
            
            {enrollment.payment !== "Paid" && (
              <Button 
                size="sm"
                onClick={() => onRecord(enrollment.id)}
              >
                Record Payment
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}