import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  File, 
  FileSpreadsheet, 
  Calendar, 
  TrendingUp,
  Users,
  GraduationCap,
  Wallet,
  Clock as FileClock,
  Receipt
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import MonthlyTrainingReport from "@/components/reports/monthly-training-report";

// Sample data for cards only
const enrollmentData = { count: 756 };
const completionData = { rate: 85 };
const paymentData = { total: 245830 };

export default function ReportsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date()
  });
  const [reportType, setReportType] = useState("monthly");
  const { toast } = useToast();
  const { user } = useAuth();

  // Format date range for display
  const formatDateRange = () => {
    if (!date?.from) return "";
    if (!date.to) return format(date.from, "PPP");
    return `${format(date.from, "PPP")} - ${format(date.to, "PPP")}`;
  };

  // Handle generating reports
  const handleGenerateReport = (format: "pdf" | "excel") => {
    toast({
      title: `${format.toUpperCase()} Report Generated`,
      description: `Your ${reportType} report has been generated and is ready to download.`,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {isSidebarOpen && <Sidebar />}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Reports Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Reports & Analytics</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleGenerateReport("pdf")}
              >
                <File className="h-4 w-4" /> Export PDF
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleGenerateReport("excel")}
              >
                <FileSpreadsheet className="h-4 w-4" /> Export Excel
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {user?.role === "cashier" ? (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-green-100">
                        <Wallet className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-lg">Total Collections</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₱245,830</div>
                    <p className="text-muted-foreground text-sm flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                      <span className="text-green-600 font-medium">8%</span> increase from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-red-100">
                        <FileClock className="h-5 w-5 text-red-600" />
                      </div>
                      <CardTitle className="text-lg">Pending Payments</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₱86,420</div>
                    <p className="text-muted-foreground text-sm flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                      <span className="text-green-600 font-medium">5%</span> decrease from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Receipt className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">Receipts Generated</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">156</div>
                    <p className="text-muted-foreground text-sm flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                      <span className="text-green-600 font-medium">12%</span> increase from last month
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Total Trainees</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">756</div>
                    <p className="text-muted-foreground text-sm flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                      <span className="text-green-600 font-medium">12%</span> increase from last year
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-secondary/10">
                        <GraduationCap className="h-5 w-5 text-secondary" />
                      </div>
                      <CardTitle className="text-lg">Completion Rate</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">85%</div>
                    <p className="text-muted-foreground text-sm flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                      <span className="text-green-600 font-medium">5%</span> increase from last year
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-accent/10">
                        <Wallet className="h-5 w-5 text-accent" />
                      </div>
                      <CardTitle className="text-lg">Total Revenue</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">₱245,830</div>
                    <p className="text-muted-foreground text-sm flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                      <span className="text-green-600 font-medium">8%</span> increase from last year
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <div className="flex flex-col gap-6 mb-6">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>
                    {user?.role === "cashier" ? "Payment Reports" : "Monthly Training and Employment Report"}
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {user?.role !== "cashier" && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor="report-type">Report Type:</Label>
                        <Select 
                          value={reportType} 
                          onValueChange={setReportType}
                        >
                          <SelectTrigger id="report-type" className="w-[250px]">
                            <SelectValue placeholder="Select report" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly Training Report</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[250px] justify-start text-left font-normal flex gap-2 items-center"
                        >
                          <Calendar className="h-4 w-4" />
                          {formatDateRange() || "Pick a date range"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full">
                  <div className="w-full">
                    {reportType === "monthly" && (
                      <MonthlyTrainingReport />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
