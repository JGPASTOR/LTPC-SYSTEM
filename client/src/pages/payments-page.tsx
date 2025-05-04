import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon } from "lucide-react";
import { Search, Plus, FileText, Receipt, CreditCard, Filter, Download, Info } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

// Define payment interface
interface Payment {
  id: string;
  traineeId: string;
  traineeName: string;
  traineeInitials: string;
  course: string;
  amount: number;
  receiptNumber: string;
  status: "Paid" | "Unpaid" | "Partial"; // Keeping "Partial" for backward compatibility, but UI will show as "Unpaid"
  paymentDate: string;
  paymentMethod: "Cash" | "Bank Transfer" | "Other";
}

// Sample payments data
const samplePayments: Payment[] = [
  {
    id: "P001",
    traineeId: "T-2023-0124",
    traineeName: "Juan Dela Cruz",
    traineeInitials: "JD",
    course: "Web Development",
    amount: 5000,
    receiptNumber: "RN-2023-001",
    status: "Paid",
    paymentDate: "2023-05-12",
    paymentMethod: "Cash"
  },
  {
    id: "P002",
    traineeId: "T-2023-0125",
    traineeName: "Maria Santos",
    traineeInitials: "MS",
    course: "Baking & Pastry Arts",
    amount: 4500,
    receiptNumber: "RN-2023-002",
    status: "Paid",
    paymentDate: "2023-05-15",
    paymentMethod: "Cash"
  },
  {
    id: "P003",
    traineeId: "T-2023-0126",
    traineeName: "Pedro Reyes",
    traineeInitials: "PR",
    course: "Electrical Installation",
    amount: 3000,
    receiptNumber: "RN-2023-003",
    status: "Partial",
    paymentDate: "2023-05-20",
    paymentMethod: "Cash"
  },
  {
    id: "P004",
    traineeId: "T-2023-0128",
    traineeName: "Elena Torres",
    traineeInitials: "ET",
    course: "Culinary Arts",
    amount: 4000,
    receiptNumber: "RN-2023-004",
    status: "Paid",
    paymentDate: "2023-06-15",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "P005",
    traineeId: "T-2023-0127",
    traineeName: "Roberto Aquino",
    traineeInitials: "RA",
    course: "Computer Servicing",
    amount: 2500,
    receiptNumber: "RN-2023-005",
    status: "Partial",
    paymentDate: "2023-06-12",
    paymentMethod: "Cash"
  }
];

// Sample trainees with unpaid fees
const sampleUnpaidTrainees = [
  {
    id: "T-2023-0127",
    name: "Ana Lim",
    initials: "AL",
    course: "Dressmaking",
    totalFee: 4000,
    amountPaid: 0,
    remaining: 4000,
    status: "Unpaid"
  },
  {
    id: "T-2023-0129",
    name: "Carlos Bautista",
    initials: "CB",
    course: "Welding",
    totalFee: 6000,
    amountPaid: 3000,
    remaining: 3000,
    status: "Partial"
  }
];

export default function PaymentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Form state for new payment
  const [newPayment, setNewPayment] = useState({
    traineeId: "",
    traineeName: "",
    course: "",
    amount: "",
    paymentMethod: "Cash",
    receiptNumber: ""
  });

  // Fetch payments
  const { data: payments, isLoading } = useQuery({
    queryKey: ["/api/payments"],
    queryFn: () => samplePayments,
  });

  // Filter payments based on search query
  const filteredPayments = payments?.filter(
    (payment) =>
      payment.traineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.traineeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle creating a new payment
  const handleCreatePayment = () => {
    toast({
      title: "Payment Recorded",
      description: `Payment of ₱${newPayment.amount} from ${newPayment.traineeName} has been recorded.`,
    });
    setIsAddDialogOpen(false);
    setNewPayment({
      traineeId: "",
      traineeName: "",
      course: "",
      amount: "",
      paymentMethod: "Cash",
      receiptNumber: ""
    });
  };

  // Handle viewing receipt
  const handleViewReceipt = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsReceiptDialogOpen(true);
  };

  // Get payment badge variant
  const getPaymentBadge = (status: Payment["status"]) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>;
      case "Unpaid":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{status}</Badge>;
      // Keep case for Partial for backward compatibility with existing data
      case "Partial":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Unpaid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {isSidebarOpen && <Sidebar />}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Payments Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Payments Management</h2>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Export Report
              </Button>
              
              {/* Only show Record Payment button for cashier role */}
              {user?.role !== "pesdo_admin" && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Record Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Record New Payment</DialogTitle>
                      <DialogDescription>
                        Enter the payment details below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="traineeId">Trainee ID</Label>
                        <Input
                          id="traineeId"
                          value={newPayment.traineeId}
                          onChange={(e) => setNewPayment({ ...newPayment, traineeId: e.target.value })}
                          placeholder="Enter trainee ID"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="traineeName">Trainee Name</Label>
                        <Input
                          id="traineeName"
                          value={newPayment.traineeName}
                          onChange={(e) => setNewPayment({ ...newPayment, traineeName: e.target.value })}
                          placeholder="Enter trainee name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="course">Course</Label>
                        <Input
                          id="course"
                          value={newPayment.course}
                          onChange={(e) => setNewPayment({ ...newPayment, course: e.target.value })}
                          placeholder="Enter course name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          value={newPayment.amount}
                          onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                          placeholder="Enter payment amount"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select
                          value={newPayment.paymentMethod}
                          onValueChange={(value) => setNewPayment({ ...newPayment, paymentMethod: value })}
                        >
                          <SelectTrigger id="paymentMethod">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="receiptNumber">Receipt Number</Label>
                        <Input
                          id="receiptNumber"
                          value={newPayment.receiptNumber}
                          onChange={(e) => setNewPayment({ ...newPayment, receiptNumber: e.target.value })}
                          placeholder="Enter receipt number"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreatePayment}>Record Payment</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              
              {/* For admin: Add a note that they can only view payments */}
              {user?.role === "pesdo_admin" && (
                <div className="text-sm text-muted-foreground flex items-center">
                  <Info className="h-4 w-4 mr-1" /> View-only mode: Payments are recorded by cashiers
                </div>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="pending">Pending Payments</TabsTrigger>
              <TabsTrigger value="summary">Payment Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Payment Records</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          className="pl-10"
                          placeholder="Search payments..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Trainee</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Receipt No.</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6">
                              Loading payments...
                            </TableCell>
                          </TableRow>
                        ) : filteredPayments?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6">
                              No payments found. Try a different search term.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredPayments?.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell className="font-medium">{payment.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-3 bg-primary text-white">
                                    <AvatarFallback>{payment.traineeInitials}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{payment.traineeName}</div>
                                    <div className="text-xs text-muted-foreground">{payment.traineeId}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{payment.course}</TableCell>
                              <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                              <TableCell>{payment.receiptNumber}</TableCell>
                              <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                              <TableCell>{getPaymentBadge(payment.status)}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleViewReceipt(payment)}
                                  >
                                    <Receipt className="h-4 w-4 text-primary" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      toast({
                                        title: "Download Receipt",
                                        description: `Downloading receipt: ${payment.receiptNumber}`,
                                      });
                                    }}
                                  >
                                    <FileText className="h-4 w-4 text-secondary" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pending">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Trainee</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Total Fee</TableHead>
                          <TableHead>Amount Paid</TableHead>
                          <TableHead>Remaining</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleUnpaidTrainees.map((trainee) => (
                          <TableRow key={trainee.id}>
                            <TableCell className="font-medium">{trainee.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3 bg-primary text-white">
                                  <AvatarFallback>{trainee.initials}</AvatarFallback>
                                </Avatar>
                                <span>{trainee.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{trainee.course}</TableCell>
                            <TableCell>{formatCurrency(trainee.totalFee)}</TableCell>
                            <TableCell>{formatCurrency(trainee.amountPaid)}</TableCell>
                            <TableCell className="font-medium text-red-600">{formatCurrency(trainee.remaining)}</TableCell>
                            <TableCell>{getPaymentBadge(trainee.status as Payment["status"])}</TableCell>
                            <TableCell>
                              {user?.role !== "pesdo_admin" ? (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setNewPayment({
                                      traineeId: trainee.id,
                                      traineeName: trainee.name,
                                      course: trainee.course,
                                      amount: trainee.remaining.toString(),
                                      paymentMethod: "Cash",
                                      receiptNumber: ""
                                    });
                                    setIsAddDialogOpen(true);
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <CreditCard className="h-3 w-3" /> Record Payment
                                </Button>
                              ) : (
                                <span className="text-sm text-muted-foreground flex items-center">
                                  <Info className="h-3.5 w-3.5 mr-1" /> Pending payment
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="summary">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Collections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">₱245,830</div>
                    <p className="text-muted-foreground text-sm">From 156 trainees</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-secondary">₱45,250</div>
                    <p className="text-muted-foreground text-sm">From 23 trainees</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Outstanding Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-destructive">₱32,500</div>
                    <p className="text-muted-foreground text-sm">From 15 trainees</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Collections by Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Total Trainees</TableHead>
                        <TableHead>Fully Paid</TableHead>
                        <TableHead>Partially Paid</TableHead>
                        <TableHead>Unpaid</TableHead>
                        <TableHead>Collection Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Web Development</TableCell>
                        <TableCell>24</TableCell>
                        <TableCell>20</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>₱115,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Culinary Arts</TableCell>
                        <TableCell>18</TableCell>
                        <TableCell>15</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>₱72,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Dressmaking</TableCell>
                        <TableCell>15</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>₱42,500</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Electrical Installation</TableCell>
                        <TableCell>22</TableCell>
                        <TableCell>16</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>₱94,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Baking & Pastry Arts</TableCell>
                        <TableCell>20</TableCell>
                        <TableCell>17</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>₱83,600</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* View Receipt Dialog */}
      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>
              Receipt for payment {selectedPayment?.receiptNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="border border-border rounded-md p-6">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">Surigao City LTPC</h3>
                <p className="text-sm text-muted-foreground">Livelihood Training and Productivity Center</p>
                <p className="text-sm text-muted-foreground">Official Receipt</p>
              </div>
              
              <div className="mb-4 flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receipt No:</p>
                  <p className="font-medium">{selectedPayment.receiptNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date:</p>
                  <p className="font-medium">{new Date(selectedPayment.paymentDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Received from:</p>
                <p className="font-medium">{selectedPayment.traineeName} ({selectedPayment.traineeId})</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Course:</p>
                <p className="font-medium">{selectedPayment.course}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Payment Method:</p>
                <p className="font-medium">{selectedPayment.paymentMethod}</p>
              </div>
              
              <div className="mb-4 border-t pt-4">
                <div className="flex justify-between">
                  <p className="font-bold">Amount Paid:</p>
                  <p className="font-bold">{formatCurrency(selectedPayment.amount)}</p>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground">Received by:</p>
                <p className="font-medium mt-8">____________________________</p>
                <p className="text-sm">Authorized Signature</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReceiptDialogOpen(false)}>Close</Button>
            <Button onClick={() => {
              setIsReceiptDialogOpen(false);
              toast({
                title: "Receipt Printed",
                description: `Receipt ${selectedPayment?.receiptNumber} has been sent to printer.`,
              });
            }}>Print Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
