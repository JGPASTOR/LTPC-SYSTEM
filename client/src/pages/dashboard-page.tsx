import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";

// Import role-specific dashboards
import { AdminPesdoDashboard } from "@/components/dashboard/admin-pesdo/admin-pesdo-dashboard";
import { EnrollmentOfficerDashboard } from "@/components/dashboard/enrollment-officer/enrollment-officer-dashboard";
import { CashierDashboard } from "@/components/dashboard/cashier/cashier-dashboard";

// Default dashboard component
function DefaultDashboard() {
  return (
    <div className="mt-8 p-6 bg-card border rounded-lg text-center">
      <h3 className="text-xl font-medium mb-2">Welcome to the LTPC Enrollment System</h3>
      <p className="text-muted-foreground">Please login with appropriate role credentials to access dashboard information.</p>
    </div>
  );
}

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

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

  // Function to render the appropriate dashboard based on user role
  const renderDashboard = () => {
    if (!user) return <DefaultDashboard />;
    
    switch (user.role) {
      case "pesdo_admin":
        return <AdminPesdoDashboard />;
      case "enrollment_officer":
        return <EnrollmentOfficerDashboard />;
      case "cashier":
        return <CashierDashboard />;
      default:
        return <DefaultDashboard />;
    }
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

          {/* Render the appropriate dashboard */}
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
}