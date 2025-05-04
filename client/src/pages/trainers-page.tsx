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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Edit, Plus, Search, Mail, Phone, Clock, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// Define schedule interface
interface ScheduleDay {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string;
  endTime: string;
  available: boolean;
}

// Define trainer interface
interface Trainer {
  id: string;
  name: string;
  expertise: string;
  email: string;
  phone: string;
  bio: string;
  activeCourses: number;
  totalTrainees: number;
  schedule?: ScheduleDay[];
}

// Sample trainers data
const sampleTrainers: Trainer[] = [
  {
    id: "TR001",
    name: "Maria Reyes",
    expertise: "Web Development",
    email: "maria.reyes@example.com",
    phone: "09123456789",
    bio: "Experienced web developer with 5 years of teaching experience specializing in HTML, CSS, JavaScript and React.",
    activeCourses: 2,
    totalTrainees: 24
  },
  {
    id: "TR002",
    name: "Pedro Santos",
    expertise: "Culinary Arts",
    email: "pedro.santos@example.com",
    phone: "09234567890",
    bio: "Professional chef with over 10 years of experience in Filipino and international cuisine. Former head chef at a 5-star hotel.",
    activeCourses: 1,
    totalTrainees: 18
  },
  {
    id: "TR003",
    name: "Lisa Garcia",
    expertise: "Dressmaking",
    email: "lisa.garcia@example.com",
    phone: "09345678901",
    bio: "Fashion designer with expertise in pattern making and garment construction. Has worked for various clothing brands.",
    activeCourses: 1,
    totalTrainees: 15
  },
  {
    id: "TR004",
    name: "Manuel Tan",
    expertise: "Electrical Installation",
    email: "manuel.tan@example.com",
    phone: "09456789012",
    bio: "Licensed electrical engineer with 8 years of experience in residential and commercial electrical systems.",
    activeCourses: 1,
    totalTrainees: 22
  },
  {
    id: "TR005",
    name: "Ana Lim",
    expertise: "Baking & Pastry Arts",
    email: "ana.lim@example.com",
    phone: "09567890123",
    bio: "Pastry chef trained in France with expertise in bread making, cakes, and desserts. Owned a bakery for 5 years.",
    activeCourses: 1,
    totalTrainees: 20
  }
];

export default function TrainersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const { toast } = useToast();

  // Default schedule for all weekdays
  const defaultSchedule: ScheduleDay[] = [
    { day: "Monday", startTime: "08:00", endTime: "17:00", available: true },
    { day: "Tuesday", startTime: "08:00", endTime: "17:00", available: true },
    { day: "Wednesday", startTime: "08:00", endTime: "17:00", available: true },
    { day: "Thursday", startTime: "08:00", endTime: "17:00", available: true },
    { day: "Friday", startTime: "08:00", endTime: "17:00", available: true },
    { day: "Saturday", startTime: "08:00", endTime: "12:00", available: false },
    { day: "Sunday", startTime: "08:00", endTime: "12:00", available: false }
  ];

  // Form state for new trainer
  const [newTrainer, setNewTrainer] = useState({
    name: "",
    expertise: "",
    email: "",
    phone: "",
    bio: "",
    schedule: [...defaultSchedule]
  });

  // Fetch trainers
  const { data: trainers, isLoading } = useQuery({
    queryKey: ["/api/trainers"],
    queryFn: () => sampleTrainers,
  });

  // Filter trainers based on search query
  const filteredTrainers = trainers?.filter(
    (trainer) =>
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle creating a new trainer
  const handleCreateTrainer = () => {
    toast({
      title: "Trainer Added",
      description: `${newTrainer.name} has been added as a trainer.`,
    });
    setIsAddDialogOpen(false);
    setNewTrainer({
      name: "",
      expertise: "",
      email: "",
      phone: "",
      bio: "",
      schedule: [...defaultSchedule]
    });
  };

  // Handle view trainer
  const handleViewTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsViewDialogOpen(true);
  };

  // Generate avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {isSidebarOpen && <Sidebar />}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Trainers Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Trainers Management</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Trainer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Trainer</DialogTitle>
                  <DialogDescription>
                    Enter the trainer information below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newTrainer.name}
                      onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expertise">Expertise</Label>
                    <Input
                      id="expertise"
                      value={newTrainer.expertise}
                      onChange={(e) => setNewTrainer({ ...newTrainer, expertise: e.target.value })}
                      placeholder="Enter area of expertise"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newTrainer.email}
                      onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newTrainer.phone}
                      onChange={(e) => setNewTrainer({ ...newTrainer, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      id="bio"
                      value={newTrainer.bio}
                      onChange={(e) => setNewTrainer({ ...newTrainer, bio: e.target.value })}
                      placeholder="Enter trainer biography"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateTrainer}>Add Trainer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>All Trainers</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    className="pl-10"
                    placeholder="Search trainers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Expertise</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Active Courses</TableHead>
                      <TableHead>Total Trainees</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          Loading trainers...
                        </TableCell>
                      </TableRow>
                    ) : filteredTrainers?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No trainers found. Try a different search term.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTrainers?.map((trainer) => (
                        <TableRow key={trainer.id}>
                          <TableCell className="font-medium">{trainer.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3 bg-secondary text-white">
                                <AvatarFallback>{getInitials(trainer.name)}</AvatarFallback>
                              </Avatar>
                              <span>{trainer.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{trainer.expertise}</TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                                <span className="text-sm">{trainer.email}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                                <span className="text-sm">{trainer.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{trainer.activeCourses}</TableCell>
                          <TableCell>{trainer.totalTrainees}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewTrainer(trainer)}
                              >
                                <Eye className="h-4 w-4 text-primary" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  toast({
                                    title: "Edit Trainer",
                                    description: `Editing trainer: ${trainer.name}`,
                                  });
                                }}
                              >
                                <Edit className="h-4 w-4 text-secondary" />
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
        </main>
      </div>
      
      {/* View Trainer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Trainer Details</DialogTitle>
            <DialogDescription>
              Complete information for this trainer.
            </DialogDescription>
          </DialogHeader>
          {selectedTrainer && (
            <div className="py-4">
              <div className="flex items-center justify-center mb-6">
                <Avatar className="h-20 w-20 bg-secondary text-white">
                  <AvatarFallback className="text-2xl">{getInitials(selectedTrainer.name)}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedTrainer.name}</h3>
                  <p className="text-muted-foreground">{selectedTrainer.expertise}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ID</p>
                    <p className="font-medium">{selectedTrainer.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Courses</p>
                    <p className="font-medium">{selectedTrainer.activeCourses}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedTrainer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedTrainer.phone}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Biography</p>
                  <p className="text-sm">{selectedTrainer.bio}</p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-medium">Current Training Statistics</p>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-2xl font-bold">{selectedTrainer.totalTrainees}</p>
                      <p className="text-xs text-muted-foreground">Total Trainees</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{selectedTrainer.activeCourses}</p>
                      <p className="text-xs text-muted-foreground">Active Courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              toast({
                title: "Edit Trainer",
                description: `Editing trainer: ${selectedTrainer?.name}`,
              });
            }}>Edit Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
