import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  File, 
  FileSpreadsheet, 
  Calendar, 
  PieChart, 
  BarChart,
  TrendingUp,
  Users,
  GraduationCap,
  Wallet
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  AreaChart, 
  Area, 
  BarChart as RechartsBarChart,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Sample enrollment data
const enrollmentData = [
  { month: 'Jan', count: 45 },
  { month: 'Feb', count: 52 },
  { month: 'Mar', count: 48 },
  { month: 'Apr', count: 65 },
  { month: 'May', count: 53 },
  { month: 'Jun', count: 59 },
  { month: 'Jul', count: 62 },
  { month: 'Aug', count: 90 },
  { month: 'Sep', count: 75 },
  { month: 'Oct', count: 62 },
  { month: 'Nov', count: 45 },
  { month: 'Dec', count: 78 }
];

// Sample completion data
const completionData = [
  { month: 'Jan', completed: 35, dropped: 3 },
  { month: 'Feb', completed: 42, dropped: 5 },
  { month: 'Mar', completed: 40, dropped: 2 },
  { month: 'Apr', completed: 55, dropped: 4 },
  { month: 'May', completed: 48, dropped: 2 },
  { month: 'Jun', completed: 54, dropped: 3 },
  { month: 'Jul', completed: 57, dropped: 2 },
  { month: 'Aug', completed: 82, dropped: 6 },
  { month: 'Sep', completed: 68, dropped: 4 },
  { month: 'Oct', completed: 55, dropped: 3 },
  { month: 'Nov', completed: 40, dropped: 2 },
  { month: 'Dec', completed: 70, dropped: 5 }
];

// Sample course distribution data
const courseDistributionData = [
  { name: 'Web Development', value: 120 },
  { name: 'Culinary Arts', value: 95 },
  { name: 'Dressmaking', value: 86 },
  { name: 'Electrical Installation', value: 144 },
  { name: 'Baking & Pastry Arts', value: 105 },
  { name: 'Computer Servicing', value: 78 },
  { name: 'Welding', value: 65 },
  { name: 'Mobile App Development', value: 42 }
];

// Sample gender distribution data
const genderDistributionData = [
  { name: 'Male', value: 425 },
  { name: 'Female', value: 331 }
];

// Sample payment data
const paymentData = [
  { month: 'Jan', amount: 23500 },
  { month: 'Feb', amount: 26800 },
  { month: 'Mar', amount: 24000 },
  { month: 'Apr', amount: 32500 },
  { month: 'May', amount: 26500 },
  { month: 'Jun', amount: 29500 },
  { month: 'Jul', amount: 31000 },
  { month: 'Aug', amount: 45000 },
  { month: 'Sep', amount: 37500 },
  { month: 'Oct', amount: 31000 },
  { month: 'Nov', amount: 22500 },
  { month: 'Dec', amount: 39000 }
];

// Sample employment data
const employmentData = [
  { course: 'Web Development', employed: 85, total: 120, rate: '71%' },
  { course: 'Culinary Arts', employed: 72, total: 95, rate: '76%' },
  { course: 'Dressmaking', employed: 58, total: 86, rate: '67%' },
  { course: 'Electrical Installation', employed: 120, total: 144, rate: '83%' },
  { course: 'Baking & Pastry Arts', employed: 85, total: 105, rate: '81%' },
  { course: 'Computer Servicing', employed: 60, total: 78, rate: '77%' },
  { course: 'Welding', employed: 58, total: 65, rate: '89%' },
  { course: 'Mobile App Development', employed: 32, total: 42, rate: '76%' }
];

export default function ReportsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date()
  });
  const [reportType, setReportType] = useState("enrollment");
  const { toast } = useToast();

  // Chart colors
  const COLORS = [
    'hsl(var(--chart-1))', 
    'hsl(var(--chart-2))', 
    'hsl(var(--chart-3))', 
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  // Mock API call for report data
  const { data: reportData, isLoading } = useQuery({
    queryKey: ["/api/reports", reportType, date],
    queryFn: () => ({
      enrollment: enrollmentData,
      completion: completionData,
      course: courseDistributionData,
      gender: genderDistributionData,
      payment: paymentData,
      employment: employmentData
    }),
  });

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
          </div>
          
          <div className="flex flex-col gap-6 mb-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>Report Generator</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="report-type">Report Type:</Label>
                      <Select 
                        value={reportType} 
                        onValueChange={setReportType}
                      >
                        <SelectTrigger id="report-type" className="w-[180px]">
                          <SelectValue placeholder="Select report" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enrollment">Enrollment Report</SelectItem>
                          <SelectItem value="completion">Completion Report</SelectItem>
                          <SelectItem value="payment">Payment Report</SelectItem>
                          <SelectItem value="employment">Employment Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
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
                <Tabs defaultValue="chart" className="w-full">
                  <TabsList className="grid w-[400px] grid-cols-3 mb-4">
                    <TabsTrigger value="chart" className="flex items-center gap-2">
                      <BarChart className="h-4 w-4" /> Chart
                    </TabsTrigger>
                    <TabsTrigger value="data" className="flex items-center gap-2">
                      <PieChart className="h-4 w-4" /> Data
                    </TabsTrigger>
                    <TabsTrigger value="table" className="flex items-center gap-2">
                      <Table className="h-4 w-4" /> Table
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chart" className="w-full">
                    <div className="h-[400px] w-full">
                      {reportType === "enrollment" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={enrollmentData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis 
                              dataKey="month" 
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
                              dataKey="count" 
                              stroke="hsl(var(--primary))" 
                              fill="hsl(var(--primary))" 
                              fillOpacity={0.3} 
                              name="Enrollments"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                      
                      {reportType === "completion" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={completionData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis 
                              dataKey="month" 
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
                            <Bar 
                              dataKey="completed" 
                              fill="hsl(var(--chart-2))" 
                              name="Completed"
                            />
                            <Bar 
                              dataKey="dropped" 
                              fill="hsl(var(--destructive))" 
                              name="Dropped Out"
                            />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      )}
                      
                      {reportType === "payment" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={paymentData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis 
                              dataKey="month" 
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
                              formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Payment Amount']}
                            />
                            <Bar 
                              dataKey="amount" 
                              fill="hsl(var(--chart-3))" 
                              name="Payment Amount"
                            />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      )}
                      
                      {reportType === "employment" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart
                              data={employmentData}
                              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                              layout="vertical"
                            >
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                type="number"
                                className="text-xs" 
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                              />
                              <YAxis 
                                dataKey="course"
                                type="category"
                                className="text-xs" 
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                width={120}
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))', 
                                  borderColor: 'hsl(var(--border))',
                                  borderRadius: '8px',
                                  color: 'hsl(var(--card-foreground))'
                                }}
                              />
                              <Bar 
                                dataKey="employed" 
                                fill="hsl(var(--chart-1))" 
                                name="Employed"
                              />
                              <Bar 
                                dataKey="total" 
                                fill="hsl(var(--chart-5))" 
                                name="Total Graduates"
                              />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                          
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={[
                                  { name: 'Employed', value: 570 },
                                  { name: 'Unemployed', value: 165 }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                <Cell fill="hsl(var(--chart-1))" />
                                <Cell fill="hsl(var(--chart-5))" />
                              </Pie>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))', 
                                  borderColor: 'hsl(var(--border))',
                                  borderRadius: '8px',
                                  color: 'hsl(var(--card-foreground))'
                                }}
                              />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="data" className="w-full">
                    <div className="h-[400px] w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                      {reportType === "enrollment" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={courseDistributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {courseDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                borderColor: 'hsl(var(--border))',
                                borderRadius: '8px',
                                color: 'hsl(var(--card-foreground))'
                              }}
                              formatter={(value: number) => [`${value} enrollees`, 'Enrollments']}
                            />
                            <Legend
                              layout="vertical"
                              verticalAlign="middle"
                              align="right"
                              wrapperStyle={{ fontSize: '12px' }}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      )}
                      
                      {reportType === "completion" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={[
                                { name: 'Completed', value: 596 },
                                { name: 'Dropped Out', value: 42 },
                                { name: 'In Progress', value: 118 }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell fill="hsl(var(--chart-2))" />
                              <Cell fill="hsl(var(--destructive))" />
                              <Cell fill="hsl(var(--chart-4))" />
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                borderColor: 'hsl(var(--border))',
                                borderRadius: '8px',
                                color: 'hsl(var(--card-foreground))'
                              }}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      )}
                      
                      {reportType === "payment" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={[
                                { name: 'Fully Paid', value: 628 },
                                { name: 'Partial Payment', value: 85 },
                                { name: 'Unpaid', value: 43 }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell fill="hsl(142, 76%, 36%)" />
                              <Cell fill="hsl(var(--chart-3))" />
                              <Cell fill="hsl(var(--destructive))" />
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                borderColor: 'hsl(var(--border))',
                                borderRadius: '8px',
                                color: 'hsl(var(--card-foreground))'
                              }}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      )}
                      
                      {reportType === "employment" && (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={[
                                { name: 'Wage Employment', value: 352 },
                                { name: 'Self-Employment', value: 218 },
                                { name: 'Unemployed', value: 165 }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell fill="hsl(var(--chart-1))" />
                              <Cell fill="hsl(var(--chart-2))" />
                              <Cell fill="hsl(var(--chart-5))" />
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                borderColor: 'hsl(var(--border))',
                                borderRadius: '8px',
                                color: 'hsl(var(--card-foreground))'
                              }}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      )}
                      
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={genderDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell fill="hsl(var(--chart-1))" />
                            <Cell fill="hsl(var(--chart-3))" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              borderColor: 'hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--card-foreground))'
                            }}
                            formatter={(value: number) => [`${value} trainees`, 'Count']}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="table" className="w-full">
                    <div className="overflow-x-auto">
                      {reportType === "enrollment" && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Month</TableHead>
                              <TableHead>Enrollments</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {enrollmentData.map((item) => (
                              <TableRow key={item.month}>
                                <TableCell>{item.month}</TableCell>
                                <TableCell>{item.count}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                      
                      {reportType === "completion" && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Month</TableHead>
                              <TableHead>Completed</TableHead>
                              <TableHead>Dropped Out</TableHead>
                              <TableHead>Completion Rate</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {completionData.map((item) => (
                              <TableRow key={item.month}>
                                <TableCell>{item.month}</TableCell>
                                <TableCell>{item.completed}</TableCell>
                                <TableCell>{item.dropped}</TableCell>
                                <TableCell>
                                  {((item.completed / (item.completed + item.dropped)) * 100).toFixed(1)}%
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                      
                      {reportType === "payment" && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Month</TableHead>
                              <TableHead>Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paymentData.map((item) => (
                              <TableRow key={item.month}>
                                <TableCell>{item.month}</TableCell>
                                <TableCell>₱{item.amount.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell className="font-bold">Total</TableCell>
                              <TableCell className="font-bold">
                                ₱{paymentData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      )}
                      
                      {reportType === "employment" && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Course</TableHead>
                              <TableHead>Employed</TableHead>
                              <TableHead>Total Graduates</TableHead>
                              <TableHead>Employment Rate</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {employmentData.map((item) => (
                              <TableRow key={item.course}>
                                <TableCell>{item.course}</TableCell>
                                <TableCell>{item.employed}</TableCell>
                                <TableCell>{item.total}</TableCell>
                                <TableCell>{item.rate}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell className="font-bold">Total</TableCell>
                              <TableCell className="font-bold">
                                {employmentData.reduce((sum, item) => sum + item.employed, 0)}
                              </TableCell>
                              <TableCell className="font-bold">
                                {employmentData.reduce((sum, item) => sum + item.total, 0)}
                              </TableCell>
                              <TableCell className="font-bold">
                                {Math.round(
                                  (employmentData.reduce((sum, item) => sum + item.employed, 0) /
                                    employmentData.reduce((sum, item) => sum + item.total, 0)) * 100
                                )}%
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Enrollments</TableHead>
                      <TableHead>% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseDistributionData.slice(0, 5).map((item) => (
                      <TableRow key={item.name}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.value}</TableCell>
                        <TableCell>
                          {Math.round((item.value / courseDistributionData.reduce((sum, item) => sum + item.value, 0)) * 100)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Employment Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Employment Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employmentData.slice(0, 5).map((item) => (
                      <TableRow key={item.course}>
                        <TableCell>{item.course}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className="bg-primary h-2.5 rounded-full"
                                style={{ width: item.rate }}
                              ></div>
                            </div>
                            <span>{item.rate}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
