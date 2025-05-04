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
import { Edit, Eye, Plus, Search, Download, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Trainer interface for selection in trainee registration
interface Trainer {
  id: string;
  name: string;
  expertise: string;
}

// Define trainee interface
interface Trainee {
  id: string;
  name: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  contact: string;
  course: string;
  enrollmentDate: string;
  status: "Active" | "Completed" | "Dropped";
  payment: "Paid" | "Partial" | "Unpaid";
  trainerId?: string;
  trainerName?: string;
}

// Sample trainees data
const sampleTrainees: Trainee[] = [
  {
    id: "T-2023-0124",
    name: "Juan Dela Cruz",
    gender: "Male",
    address: "123 Main St, Surigao City",
    contact: "09123456789",
    course: "Web Development",
    enrollmentDate: "2023-05-10",
    status: "Active",
    payment: "Paid"
  },
  {
    id: "T-2023-0125",
    name: "Maria Santos",
    gender: "Female",
    address: "456 Oak Ave, Surigao City",
    contact: "09234567890",
    course: "Baking & Pastry Arts",
    enrollmentDate: "2023-05-15",
    status: "Active",
    payment: "Paid"
  },
  {
    id: "T-2023-0126",
    name: "Pedro Reyes",
    gender: "Male",
    address: "789 Pine St, Surigao City",
    contact: "09345678901",
    course: "Electrical Installation",
    enrollmentDate: "2023-05-20",
    status: "Active",
    payment: "Partial"
  },
  {
    id: "T-2023-0127",
    name: "Ana Lim",
    gender: "Female",
    address: "321 Maple Dr, Surigao City",
    contact: "09456789012",
    course: "Dressmaking",
    enrollmentDate: "2023-06-01",
    status: "Active",
    payment: "Unpaid"
  },
  {
    id: "T-2023-0128",
    name: "Roberto Aquino",
    gender: "Male",
    address: "654 Cedar Ln, Surigao City",
    contact: "09567890123",
    course: "Computer Servicing",
    enrollmentDate: "2023-06-10",
    status: "Active",
    payment: "Partial"
  },
  {
    id: "T-2023-0129",
    name: "Elena Torres",
    gender: "Female",
    address: "987 Birch Ave, Surigao City",
    contact: "09678901234",
    course: "Culinary Arts",
    enrollmentDate: "2023-06-15",
    status: "Completed",
    payment: "Paid"
  }
];

// Sample courses for dropdown
const courses = [
  "Web Development",
  "Culinary Arts",
  "Dressmaking",
  "Electrical Installation",
  "Baking & Pastry Arts",
  "Computer Servicing"
];

// Sample trainers for dropdown
const sampleAvailableTrainers: Trainer[] = [
  { id: "TR001", name: "Maria Reyes", expertise: "Web Development" },
  { id: "TR002", name: "Pedro Santos", expertise: "Culinary Arts" },
  { id: "TR003", name: "Lisa Garcia", expertise: "Dressmaking" },
  { id: "TR004", name: "Manuel Tan", expertise: "Electrical Installation" },
  { id: "TR005", name: "Ana Lim", expertise: "Baking & Pastry Arts" }
];

export default function TraineesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
  const { toast } = useToast();

  // Form state for new trainee
  const [newTrainee, setNewTrainee] = useState({
    name: "",
    gender: "Male" as Trainee["gender"],
    address: "",
    contact: "",
    course: "",
    status: "Active" as Trainee["status"],
    payment: "Unpaid" as Trainee["payment"],
    trainerId: "",
    trainerName: ""
  });

  // Fetch trainees
  const { data: trainees, isLoading } = useQuery({
    queryKey: ["/api/trainees"],
    queryFn: () => sampleTrainees,
  });

  // Filter trainees based on search query
  const filteredTrainees = trainees?.filter(
    (trainee) =>
      trainee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainee.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainee.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainee.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get trainer name by ID
  const getTrainerNameById = (id: string) => {
    const trainer = sampleAvailableTrainers.find(trainer => trainer.id === id);
    return trainer ? trainer.name : "";
  };

  // Handle trainer change in form
  const handleTrainerChange = (trainerId: string) => {
    const trainerName = getTrainerNameById(trainerId);
    setNewTrainee({ ...newTrainee, trainerId, trainerName });
  };

  // Handle creating a new trainee
  const handleCreateTrainee = () => {
    const trainerInfo = newTrainee.trainerId 
      ? ` and assigned to ${newTrainee.trainerName}`
      : "";
      
    toast({
      title: "Trainee Registered",
      description: `${newTrainee.name} has been successfully registered${trainerInfo}.`,
    });
    setIsAddDialogOpen(false);
    setNewTrainee({
      name: "",
      gender: "Male",
      address: "",
      contact: "",
      course: "",
      status: "Active",
      payment: "Unpaid",
      trainerId: "",
      trainerName: ""
    });
  };

  // Handle view trainee
  const handleViewTrainee = (trainee: Trainee) => {
    setSelectedTrainee(trainee);
    setIsViewDialogOpen(true);
  };

  // Get status badge variant
  const getStatusBadge = (status: Trainee["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>;
      case "Completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>;
      case "Dropped":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get payment badge variant
  const getPaymentBadge = (payment: Trainee["payment"]) => {
    switch (payment) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{payment}</Badge>;
      case "Partial":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{payment}</Badge>;
      case "Unpaid":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{payment}</Badge>;
      default:
        return <Badge>{payment}</Badge>;
    }
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
        
        {/* Trainees Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Trainees Management</h2>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Register Trainee
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Register New Trainee</DialogTitle>
                    <DialogDescription>
                      Enter the trainee information below to register them in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newTrainee.name}
                        onChange={(e) => setNewTrainee({ ...newTrainee, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={newTrainee.gender}
                        onValueChange={(value) => setNewTrainee({ ...newTrainee, gender: value as Trainee["gender"] })}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newTrainee.address}
                        onChange={(e) => setNewTrainee({ ...newTrainee, address: e.target.value })}
                        placeholder="Enter address"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact">Contact Number</Label>
                      <Input
                        id="contact"
                        value={newTrainee.contact}
                        onChange={(e) => setNewTrainee({ ...newTrainee, contact: e.target.value })}
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="course">Course</Label>
                      <Select
                        value={newTrainee.course}
                        onValueChange={(value) => setNewTrainee({ ...newTrainee, course: value })}
                      >
                        <SelectTrigger id="course">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="payment">Payment Status</Label>
                      <Select
                        value={newTrainee.payment}
                        onValueChange={(value) => setNewTrainee({ ...newTrainee, payment: value as Trainee["payment"] })}
                      >
                        <SelectTrigger id="payment">
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Partial">Partial</SelectItem>
                          <SelectItem value="Unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="trainer">Assign Trainer</Label>
                      <Select
                        value={newTrainee.trainerId}
                        onValueChange={handleTrainerChange}
                      >
                        <SelectTrigger id="trainer">
                          <SelectValue placeholder="Select a trainer (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {newTrainee.course && (
                            <>
                              {sampleAvailableTrainers
                                .filter(trainer => !newTrainee.course || trainer.expertise === newTrainee.course)
                                .map((trainer) => (
                                  <SelectItem key={trainer.id} value={trainer.id}>
                                    {trainer.name} - {trainer.expertise}
                                  </SelectItem>
                                ))}
                              {!sampleAvailableTrainers.some(trainer => trainer.expertise === newTrainee.course) && (
                                <SelectItem disabled value="none">No specialized trainers found for this course</SelectItem>
                              )}
                            </>
                          )}
                          {!newTrainee.course && (
                            <SelectItem disabled value="none">Select a course first</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {newTrainee.course 
                          ? "Trainers with matching expertise will be shown" 
                          : "Please select a course first to see available trainers"}
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateTrainee}>Register</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>All Trainees</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    className="pl-10"
                    placeholder="Search trainees..."
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
                      <TableHead>Course</TableHead>
                      <TableHead>Trainer</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          Loading trainees...
                        </TableCell>
                      </TableRow>
                    ) : filteredTrainees?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No trainees found. Try a different search term.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTrainees?.map((trainee) => (
                        <TableRow key={trainee.id}>
                          <TableCell className="font-medium">{trainee.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3 bg-primary text-white">
                                <AvatarFallback>{getInitials(trainee.name)}</AvatarFallback>
                              </Avatar>
                              <span>{trainee.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{trainee.course}</TableCell>
                          <TableCell>{new Date(trainee.enrollmentDate).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(trainee.status)}</TableCell>
                          <TableCell>{getPaymentBadge(trainee.payment)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewTrainee(trainee)}
                              >
                                <Eye className="h-4 w-4 text-primary" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  toast({
                                    title: "Edit Trainee",
                                    description: `Editing trainee: ${trainee.name}`,
                                  });
                                }}
                              >
                                <Edit className="h-4 w-4 text-secondary" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  toast({
                                    title: "Download Certificate",
                                    description: `Downloading certificate for: ${trainee.name}`,
                                  });
                                }}
                              >
                                <FileText className="h-4 w-4 text-accent" />
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
      
      {/* View Trainee Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Trainee Details</DialogTitle>
            <DialogDescription>
              Complete information for this trainee.
            </DialogDescription>
          </DialogHeader>
          {selectedTrainee && (
            <div className="py-4">
              <div className="flex items-center justify-center mb-6">
                <Avatar className="h-20 w-20 bg-primary text-white">
                  <AvatarFallback className="text-2xl">{getInitials(selectedTrainee.name)}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-medium">{selectedTrainee.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedTrainee.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{selectedTrainee.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{selectedTrainee.contact}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedTrainee.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Course</p>
                  <p className="font-medium">{selectedTrainee.course}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Enrollment Date</p>
                  <p className="font-medium">{new Date(selectedTrainee.enrollmentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedTrainee.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <div className="mt-1">{getPaymentBadge(selectedTrainee.payment)}</div>
                </div>
                {selectedTrainee.trainerId && selectedTrainee.trainerName && (
                  <div className="col-span-2 mt-2 pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Assigned Trainer</p>
                    <p className="font-medium">{selectedTrainee.trainerName}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
