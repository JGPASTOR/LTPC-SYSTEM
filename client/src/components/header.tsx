import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Search, 
  Bell, 
  Mail, 
  Menu 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Get page title based on current location
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/courses":
        return "Courses";
      case "/trainees":
        return "Trainees";
      case "/trainers":
        return "Trainers";
      case "/payments":
        return "Payments";
      case "/reports":
        return "Reports";
      case "/users":
        return "Users";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-4 lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5 text-gray-500" />
        </Button>
        <h1 className="text-xl font-medium text-gray-800">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center">
        {/* Search */}
        <div className="relative mr-4 hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg text-sm w-60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-gray-600" />
          <Badge className="absolute top-1 right-1 bg-destructive w-4 h-4 p-0 flex items-center justify-center text-xs">
            3
          </Badge>
        </Button>
        
        {/* Messages */}
        <Button variant="ghost" size="icon" className="relative rounded-full mx-2">
          <Mail className="h-5 w-5 text-gray-600" />
          <Badge className="absolute top-1 right-1 bg-primary w-4 h-4 p-0 flex items-center justify-center text-xs">
            5
          </Badge>
        </Button>
      </div>
    </header>
  );
}
