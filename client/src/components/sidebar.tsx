import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Wallet,
  FileText, 
  User, 
  Settings, 
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const NavItem = ({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <a className={`sidebar-link ${isActive ? 'sidebar-active' : ''}`}>
          <Icon className="w-5 h-5 mr-3" />
          <span>{children}</span>
        </a>
      </Link>
    );
  };

  return (
    <div className="w-64 bg-primary text-white flex-shrink-0 flex flex-col h-screen">
      <div className="p-4 flex items-center border-b border-sidebar-border">
        <div className="w-10 h-10 mr-3 rounded-full bg-white flex items-center justify-center text-primary font-bold">
          LTPC
        </div>
        <div>
          <div className="font-medium text-sm">Surigao City</div>
          <div className="font-bold text-lg">LTPC</div>
        </div>
      </div>
      
      {/* User Profile */}
      <div className="p-4 mb-4 border-b border-sidebar-border flex items-center">
        <Avatar className="w-10 h-10 mr-3">
          <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
            {user ? getInitials(user.name) : 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm">{user?.name}</div>
          <div className="text-xs opacity-70">{user?.role}</div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="px-2 flex-1 overflow-y-auto">
        <p className="text-xs uppercase text-gray-400 pl-3 mb-2 mt-4">Main Navigation</p>
        <NavItem href="/" icon={LayoutDashboard}>Dashboard</NavItem>
        
        {/* Show all navigation options for PESDO Admin */}
        {user?.role === "pesdo_admin" && (
          <>
            <NavItem href="/courses" icon={BookOpen}>Courses</NavItem>
            <NavItem href="/trainees" icon={Users}>Trainees</NavItem>
            <NavItem href="/trainers" icon={GraduationCap}>Trainers</NavItem>
            <NavItem href="/payments" icon={Wallet}>Payments</NavItem>
            <NavItem href="/reports" icon={FileText}>Reports</NavItem>
            
            <p className="text-xs uppercase text-gray-400 pl-3 mb-2 mt-6">Administration</p>
            <NavItem href="/users" icon={User}>Users</NavItem>
            <NavItem href="/settings" icon={Settings}>Settings</NavItem>
          </>
        )}
        
        {/* Enrollment Officer can access courses, trainees, and trainers */}
        {user?.role === "enrollment_officer" && (
          <>
            <NavItem href="/courses" icon={BookOpen}>Courses</NavItem>
            <NavItem href="/trainees" icon={Users}>Trainees</NavItem>
            <NavItem href="/trainers" icon={GraduationCap}>Trainers</NavItem>
          </>
        )}
        
        {/* Cashier can access payments only */}
        {user?.role === "cashier" && (
          <>
            <NavItem href="/payments" icon={Wallet}>Payments</NavItem>
          </>
        )}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white hover:bg-sidebar-primary"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
          {logoutMutation.isPending && <span className="ml-2 animate-spin">⟳</span>}
        </Button>
      </div>
    </div>
  );
}
