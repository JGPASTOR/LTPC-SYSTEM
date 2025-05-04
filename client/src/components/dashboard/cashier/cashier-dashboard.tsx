import { Wallet, FileClock, Receipt, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { RecentActivities, Activity } from "@/components/dashboard/recent-activities";
import { PaymentStatusCards } from "./payment-status-cards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Payment summary interface
interface PaymentSummary {
  id: string;
  period: string;
  totalAmount: number;
  paidCount: number;
  pendingCount: number;
}

// Payment record interface
interface PaymentRecord {
  id: string;
  traineeName: string;
  traineeInitials: string;
  courseName: string;
  trainerName: string;
  status: "Active" | "Completed" | "Dropped";
  payment: "Paid" | "Partial" | "Unpaid";
  amountDue: number;
  amountPaid: number;
  balanceDue: number;
  lastPaymentDate?: string;
}

// Demo data for cashier dashboard
const getPaymentRecords = (): PaymentRecord[] => [
  {
    id: "enr1",
    traineeName: "John Smith",
    traineeInitials: "JS",
    courseName: "Welding Technology",
    trainerName: "Juan Dela Cruz",
    status: "Active",
    payment: "Unpaid",
    amountDue: 1500,
    amountPaid: 0,
    balanceDue: 1500
  },
  {
    id: "enr2",
    traineeName: "Jane Doe",
    traineeInitials: "JD",
    courseName: "Food Processing",
    trainerName: "Maria Santos",
    status: "Active",
    payment: "Partial",
    amountDue: 1200,
    amountPaid: 600,
    balanceDue: 600,
    lastPaymentDate: "2025-04-15"
  },
  {
    id: "enr3",
    traineeName: "Carlos Mendoza",
    traineeInitials: "CM",
    courseName: "Automotive Servicing",
    trainerName: "Roberto Reyes",
    status: "Active",
    payment: "Unpaid",
    amountDue: 2000,
    amountPaid: 0,
    balanceDue: 2000
  },
  {
    id: "enr4",
    traineeName: "Sofia Garcia",
    traineeInitials: "SG",
    courseName: "Electronics Servicing",
    trainerName: "Elena Gomez",
    status: "Active",
    payment: "Partial",
    amountDue: 1800,
    amountPaid: 900,
    balanceDue: 900,
    lastPaymentDate: "2025-04-28"
  },
  {
    id: "enr5",
    traineeName: "Miguel Lopez",
    traineeInitials: "ML",
    courseName: "Carpentry",
    trainerName: "Pedro Reyes",
    status: "Active",
    payment: "Paid",
    amountDue: 1200,
    amountPaid: 1200,
    balanceDue: 0,
    lastPaymentDate: "2025-05-02"
  }
];

const getRecentPaymentActivities = (): Activity[] => [
  {
    id: "act1",
    type: "payment",
    content: "Payment received for John Smith - Welding Technology (₱1,500)",
    timestamp: "2025-05-04T06:30:00Z"
  },
  {
    id: "act2",
    type: "payment",
    content: "Partial payment received for Jane Doe - Food Processing (₱750)",
    timestamp: "2025-05-03T15:45:00Z"
  },
  {
    id: "act3",
    type: "payment",
    content: "Payment received for Miguel Lopez - Carpentry (₱1,200)",
    timestamp: "2025-05-02T10:15:00Z"
  },
  {
    id: "act4",
    type: "payment",
    content: "Receipt generated for Sofia Garcia - Electronics Servicing",
    timestamp: "2025-05-01T14:20:00Z"
  }
];

const getPaymentSummaries = (): PaymentSummary[] => [
  {
    id: "ps1",
    period: "May 2025",
    totalAmount: 25600,
    paidCount: 24,
    pendingCount: 30
  },
  {
    id: "ps2",
    period: "April 2025",
    totalAmount: 32450,
    paidCount: 34,
    pendingCount: 20
  },
  {
    id: "ps3",
    period: "March 2025",
    totalAmount: 28900,
    paidCount: 30,
    pendingCount: 12
  }
];

export function CashierDashboard() {
  const { toast } = useToast();

  // In a real app, these would be API queries
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/cashier/stats"],
    queryFn: () => ({
      totalCollected: "₱86,950",
      pendingPayments: 30,
      receiptsGenerated: 82,
    }),
  });

  const handleViewEnrollment = (id: string) => {
    toast({
      title: "View Payment Details",
      description: `Viewing payment details for enrollment ID: ${id}`,
    });
  };

  const handleEditEnrollment = (id: string) => {
    toast({
      title: "Record Payment",
      description: `Recording payment for enrollment ID: ${id}`,
    });
  };

  const handleGenerateReceipt = (id: string) => {
    toast({
      title: "Generate Receipt",
      description: `Generating receipt for payment summary ID: ${id}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Total Collected"
          value={stats?.totalCollected || "₱0"}
          icon={Wallet}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          changeValue={15}
          changeLabel="vs. last month"
        />
        <StatsCard
          title="Pending Payments"
          value={stats?.pendingPayments || 0}
          icon={FileClock}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
          changeValue={-5}
          changeLabel="vs. last month"
        />
        <StatsCard
          title="Receipts Generated"
          value={stats?.receiptsGenerated || 0}
          icon={Receipt}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          changeValue={8}
          changeLabel="vs. last month"
        />
      </div>

      {/* Payment Status Cards */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Payment Status</h2>
          <div className="flex gap-2 text-sm">
            <div className="flex items-center mr-3">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
              <span>Paid</span>
            </div>
          </div>
        </div>
        <PaymentStatusCards
          enrollments={getPaymentRecords().sort((a, b) => {
            // Show unpaid first, then partial, then paid
            const paymentOrder = { "Unpaid": 0, "Partial": 1, "Paid": 2 };
            return paymentOrder[a.payment] - paymentOrder[b.payment];
          })}
          onView={handleViewEnrollment}
          onRecord={handleEditEnrollment}
        />
      </div>
      
      {/* Payment Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Payment Summaries</CardTitle>
          <CardDescription>
            Monthly payment collection and status overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getPaymentSummaries().map((summary) => (
                <TableRow key={summary.id}>
                  <TableCell className="font-medium">
                    {summary.period}
                  </TableCell>
                  <TableCell>₱{summary.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800">
                      {summary.paidCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800">
                      {summary.pendingCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateReceipt(summary.id)}
                    >
                      <Receipt className="h-4 w-4 mr-1" />
                      Generate Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Payment Activities */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Payment Activities</h2>
        <RecentActivities 
          activities={getRecentPaymentActivities()} 
        />
      </div>
    </div>
  );
}