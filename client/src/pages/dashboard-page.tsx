import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { EnrollmentChart } from "@/components/dashboard/enrollment-chart";
import { CourseDistribution } from "@/components/dashboard/course-distribution";
import { UpcomingBatches, TrainingBatch } from "@/components/dashboard/upcoming-batches";
import { RecentActivities, Activity } from "@/components/dashboard/recent-activities";
import { EnrollmentTable, Enrollment } from "@/components/enrollments/enrollment-table";
import { UserCheck, BookOpen, GraduationCap, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Define dummy data (this would come from the API in a real implementation)
const getMonthlyEnrollmentData = () => [
  { name: "Jan", enrollments: 65 },
  { name: "Feb", enrollments: 59 },
  { name: "Mar", enrollments: 80 },
  { name: "Apr", enrollments: 81 },
  { name: "May", enrollments: 56 },
  { name: "Jun", enrollments: 55 },
  { name: "Jul", enrollments: 40 },
  { name: "Aug", enrollments: 70 },
  { name: "Sep", enrollments: 90 },
  { name: "Oct", enrollments: 110 },
  { name: "Nov", enrollments: 100 },
  { name: "Dec", enrollments: 50 },
];

const getQuarterlyEnrollmentData = () => [
  { name: "Q1", enrollments: 204 },
  { name: "Q2", enrollments: 192 },
  { name: "Q3", enrollments: 200 },
  { name: "Q4", enrollments: 260 },
];

const getYearlyEnrollmentData = () => [
  { name: "2020", enrollments: 700 },
  { name: "2021", enrollments: 620 },
  { name: "2022", enrollments: 810 },
  { name: "2023", enrollments: 856 },
];

const getCourseDistributionData = () => [
  { name: "Web Development", value: 120 },
  { name: "Culinary Arts", value: 95 },
  { name: "Dressmaking", value: 86 },
  { name: "Electrical", value: 144 },
  { name: "Baking", value: 105 },
];

const getUpcomingBatches = (): TrainingBatch[] => [
  {
    id: "1",
    title: "Web Development Batch 23A",
    startDate: "June 15, 2023",
    trainer: "Maria Reyes",
    enrolled: 12,
    capacity: 20
  },
  {
    id: "2",
    title: "Culinary Arts Batch 16C",
    startDate: "June 20, 2023",
    trainer: "Pedro Santos",
    enrolled: 8,
    capacity: 15
  },
  {
    id: "3",
    title: "Dressmaking Batch 10B",
    startDate: "July 1, 2023",
    trainer: "Lisa Garcia",
    enrolled: 5,
    capacity: 15
  }
];

const getRecentActivities = (): Activity[] => [
  {
    id: "1",
    type: "enrollment",
    content: "<span class='font-medium'>Juan Dela Cruz</span> registered for <span class='font-medium'>Web Development</span> course",
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    type: "payment",
    content: "<span class='font-medium'>Elena Torres</span> completed payment for <span class='font-medium'>Baking & Pastry Arts</span>",
    timestamp: "3 hours ago"
  },
  {
    id: "3",
    type: "course",
    content: "<span class='font-medium'>Admin</span> added a new course: <span class='font-medium'>Mobile App Development</span>",
    timestamp: "5 hours ago"
  },
  {
    id: "4",
    type: "assessment",
    content: "<span class='font-medium'>Mario Mendoza</span> completed <span class='font-medium'>Culinary Arts</span> assessment",
    timestamp: "1 day ago"
  },
  {
    id: "5",
    type: "trainer",
    content: "<span class='font-medium'>Admin</span> added <span class='font-medium'>James Rivera</span> as a new trainer",
    timestamp: "2 days ago"
  }
];

const getRecentEnrollments = (): Enrollment[] => [
  {
    id: "T-2023-0124",
    traineeName: "Juan Dela Cruz",
    traineeInitials: "JD",
    courseName: "Web Development",
    trainerName: "Maria Reyes",
    status: "Active",
    payment: "Paid"
  },
  {
    id: "T-2023-0125",
    traineeName: "Mario Mendoza",
    traineeInitials: "MM",
    courseName: "Culinary Arts",
    trainerName: "Pedro Santos",
    status: "Active",
    payment: "Partial"
  },
  {
    id: "T-2023-0126",
    traineeName: "Sarah Domingo",
    traineeInitials: "SD",
    courseName: "Dressmaking",
    trainerName: "Lisa Garcia",
    status: "Active",
    payment: "Unpaid"
  },
  {
    id: "T-2023-0127",
    traineeName: "Roberto Aquino",
    traineeInitials: "RA",
    courseName: "Electrical Installation",
    trainerName: "Manuel Tan",
    status: "Active",
    payment: "Paid"
  },
  {
    id: "T-2023-0128",
    traineeName: "Elena Torres",
    traineeInitials: "ET",
    courseName: "Baking & Pastry Arts",
    trainerName: "Ana Lim",
    status: "Active",
    payment: "Paid"
  },
  {
    id: "T-2023-0129",
    traineeName: "Carlos Bautista",
    traineeInitials: "CB",
    courseName: "Welding",
    trainerName: "Roberto Reyes",
    status: "Active",
    payment: "Partial"
  },
  {
    id: "T-2023-0130",
    traineeName: "Maria Santos",
    traineeInitials: "MS",
    courseName: "Computer Servicing",
    trainerName: "Pedro Lim",
    status: "Active",
    payment: "Paid"
  }
];

// Role-specific dashboard component
type RoleSpecificDashboardProps = {
  userRole?: string;
  onViewEnrollment: (id: string) => void;
  onEditEnrollment: (id: string) => void;
};

function RoleSpecificDashboard({ userRole, onViewEnrollment, onEditEnrollment }: RoleSpecificDashboardProps) {
  // PESDO Admin View
  if (userRole === "pesdo_admin") {
    return (
      <>
        {/* Middle Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <EnrollmentChart
            monthlyData={getMonthlyEnrollmentData()}
            quarterlyData={getQuarterlyEnrollmentData()}
            yearlyData={getYearlyEnrollmentData()}
          />
          <CourseDistribution
            data={getCourseDistributionData()}
          />
        </div>
        
        {/* Recent Enrollments Table */}
        <EnrollmentTable
          enrollments={getRecentEnrollments()}
          onView={onViewEnrollment}
          onEdit={onEditEnrollment}
        />
        
        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpcomingBatches batches={getUpcomingBatches()} />
          <RecentActivities activities={getRecentActivities()} />
        </div>
      </>
    );
  }
  
  // Enrollment Officer View
  if (userRole === "enrollment_officer") {
    return (
      <>
        {/* Enrollments Table */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Enrollments</h2>
          <EnrollmentTable
            enrollments={getRecentEnrollments()}
            onView={onViewEnrollment}
            onEdit={onEditEnrollment}
          />
        </div>
        
        {/* Upcoming Batches */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Batches</h2>
          <UpcomingBatches batches={getUpcomingBatches()} />
        </div>
      </>
    );
  }
  
  // Cashier View
  if (userRole === "cashier") {
    return (
      <>
        {/* Enrollments with Payment Status */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
          <EnrollmentTable
            enrollments={getRecentEnrollments().sort((a, b) => {
              // Show unpaid first, then partial, then paid
              const paymentOrder = { "Unpaid": 0, "Partial": 1, "Paid": 2 };
              return paymentOrder[a.payment] - paymentOrder[b.payment];
            })}
            onView={onViewEnrollment}
            onEdit={onEditEnrollment}
          />
        </div>
        
        {/* Recent Payment Activities */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Payment Activities</h2>
          <RecentActivities 
            activities={getRecentActivities().filter(a => a.type === "payment")} 
          />
        </div>
      </>
    );
  }
  
  // Default view - if role doesn't match or is undefined
  return (
    <div className="mt-8 p-6 bg-card border rounded-lg text-center">
      <h3 className="text-xl font-medium mb-2">Welcome to the LTPC Enrollment System</h3>
      <p className="text-muted-foreground">Please login with appropriate role credentials to access dashboard information.</p>
    </div>
  );
}

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Here we'd use real API data in a production app
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: () => ({
      totalEnrollments: 756,
      activeCourses: 24,
      completedTrainings: 189,
      paymentCollection: "₱245,830"
    }),
  });

  const handleViewEnrollment = (id: string) => {
    toast({
      title: "View Enrollment",
      description: `Viewing enrollment with ID: ${id}`,
    });
  };

  const handleEditEnrollment = (id: string) => {
    toast({
      title: "Edit Enrollment",
      description: `Editing enrollment with ID: ${id}`,
    });
  };

  // Role-specific title and welcome message
  const getDashboardTitle = () => {
    switch (user?.role) {
      case "pesdo_admin":
        return "PESDO Admin Dashboard";
      case "enrollment_officer":
        return "Enrollment Officer Dashboard";
      case "cashier":
        return "Cashier Dashboard";
      default:
        return "Dashboard";
    }
  };

  const getWelcomeMessage = () => {
    const timeOfDay = new Date().getHours();
    let greeting = "Good ";
    
    if (timeOfDay < 12) greeting += "morning";
    else if (timeOfDay < 18) greeting += "afternoon";
    else greeting += "evening";
    
    const roleName = user?.role ? user.role.replace('_', ' ') : '';
    return `${greeting}, ${user?.name || ''}. Welcome to your ${roleName} dashboard.`;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {isSidebarOpen && <Sidebar />}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{getDashboardTitle()}</h1>
            <p className="text-muted-foreground">{getWelcomeMessage()}</p>
          </div>

          {/* Quick Stats - Shown to all roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* All users see enrollments */}
            <StatsCard
              title="Total Enrollments"
              value={stats?.totalEnrollments || 0}
              icon={UserCheck}
              iconBgColor="bg-primary"
              iconColor="text-primary"
              changeValue={12}
            />
            
            {/* PESDO Admin and Enrollment Officer see courses */}
            {(user?.role === "pesdo_admin" || user?.role === "enrollment_officer") && (
              <StatsCard
                title="Active Courses"
                value={stats?.activeCourses || 0}
                icon={BookOpen}
                iconBgColor="bg-secondary"
                iconColor="text-secondary"
                changeValue={5}
              />
            )}
            
            {/* PESDO Admin and Enrollment Officer see completed trainings */}
            {(user?.role === "pesdo_admin" || user?.role === "enrollment_officer") && (
              <StatsCard
                title="Completed Trainings"
                value={stats?.completedTrainings || 0}
                icon={GraduationCap}
                iconBgColor="bg-success"
                iconColor="text-success"
                changeValue={8}
              />
            )}
            
            {/* PESDO Admin and Cashier see payment collections */}
            {(user?.role === "pesdo_admin" || user?.role === "cashier") && (
              <StatsCard
                title="Payment Collection"
                value={stats?.paymentCollection || "₱0"}
                icon={Wallet}
                iconBgColor="bg-accent"
                iconColor="text-accent"
                changeValue={-3}
              />
            )}
          </div>
          
          {/* Role-specific content */}
          <RoleSpecificDashboard 
            userRole={user?.role} 
            onViewEnrollment={handleViewEnrollment}
            onEditEnrollment={handleEditEnrollment}
          />
        </main>
      </div>
    </div>
  );
}