import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Edit, 
  Eye, 
  Plus, 
  Search, 
  Download, 
  FileText, 
  Award,
  FileCheck,
  ClipboardCheck,
  Check,
  XCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

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
  payment: "Paid" | "Unpaid";
  trainerId?: string;
  trainerName?: string;
}

// Define assessment interface
interface Assessment {
  id: string;
  traineeId: string;
  traineeName: string;
  course: string;
  assessmentType: "Written" | "Practical" | "Project" | "Final";
  assessmentDate: string;
  score: number;
  maxScore: number;
  result: "Pass" | "Fail" | "Pending";
  comments: string;
}

// Define training result interface
interface TrainingResult {
  id: string;
  traineeId: string;
  traineeName: string;
  course: string;
  completionDate: string;
  overallRating: number;
  feedback: string;
  certificateIssued: boolean;
  certificateNumber?: string;
  issuedDate?: string;
  employmentStatus: "Employed" | "Unemployed" | "Referred" | "Unknown";
  employmentDetails?: string;
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
    payment: "Unpaid"
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
    payment: "Unpaid"
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

// Sample assessments data
const sampleAssessments: Assessment[] = [
  {
    id: "A-001",
    traineeId: "T-2023-0124",
    traineeName: "Juan Dela Cruz",
    course: "Web Development",
    assessmentType: "Written",
    assessmentDate: "2023-06-01",
    score: 85,
    maxScore: 100,
    result: "Pass",
    comments: "Good understanding of HTML and CSS concepts."
  },
  {
    id: "A-002",
    traineeId: "T-2023-0124",
    traineeName: "Juan Dela Cruz",
    course: "Web Development",
    assessmentType: "Practical",
    assessmentDate: "2023-06-15",
    score: 90,
    maxScore: 100,
    result: "Pass",
    comments: "Excellent implementation of responsive design principles."
  },
  {
    id: "A-003",
    traineeId: "T-2023-0129",
    traineeName: "Elena Torres",
    course: "Culinary Arts",
    assessmentType: "Final",
    assessmentDate: "2023-07-30",
    score: 95,
    maxScore: 100,
    result: "Pass",
    comments: "Outstanding culinary skills demonstrated in final cooking competition."
  }
];

// Sample training results data
const sampleTrainingResults: TrainingResult[] = [
  {
    id: "TR-001",
    traineeId: "T-2023-0129",
    traineeName: "Elena Torres",
    course: "Culinary Arts",
    completionDate: "2023-08-01",
    overallRating: 4.8,
    feedback: "Elena has shown exceptional skills in culinary arts and food preparation. Her final project impressed all judges.",
    certificateIssued: true,
    certificateNumber: "CERT-2023-0001",
    issuedDate: "2023-08-05",
    employmentStatus: "Employed",
    employmentDetails: "Hired as Assistant Chef at Surigao Grand Hotel"
  }
];

export default function TraineesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddAssessmentDialogOpen, setIsAddAssessmentDialogOpen] = useState(false);
  const [isAddTrainingResultDialogOpen, setIsAddTrainingResultDialogOpen] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const { user } = useAuth();

  // Form state for new assessment
  const [newAssessment, setNewAssessment] = useState<Partial<Assessment>>({
    assessmentType: "Written",
    score: 0,
    maxScore: 100,
    result: "Pending",
    comments: ""
  });

  // Form state for new training result
  const [newTrainingResult, setNewTrainingResult] = useState<Partial<TrainingResult>>({
    overallRating: 0,
    feedback: "",
    certificateIssued: false,
    employmentStatus: "Unknown"
  });

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
  
  // Fetch assessments for selected trainee
  const { data: assessments } = useQuery({
    queryKey: ["/api/assessments/trainee", selectedTrainee?.id],
    queryFn: () => sampleAssessments.filter(a => a.traineeId === selectedTrainee?.id),
    enabled: !!selectedTrainee && isViewDialogOpen,
  });
  
  // Fetch training results for selected trainee
  const { data: trainingResult } = useQuery({
    queryKey: ["/api/training-results/trainee", selectedTrainee?.id],
    queryFn: () => sampleTrainingResults.find(r => r.traineeId === selectedTrainee?.id),
    enabled: !!selectedTrainee && isViewDialogOpen,
  });

  // State for course filter
  const [courseFilter, setCourseFilter] = useState<string>("");
  
  // Filter trainees based on search query and course filter
  const filteredTrainees = trainees?.filter(
    (trainee) => {
      // First apply course filter if selected
      if (courseFilter && trainee.course !== courseFilter) {
        return false;
      }
      
      // Then apply search query filter
      return trainee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainee.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainee.status.toLowerCase().includes(searchQuery.toLowerCase());
    }
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
  
  // Add assessment mutation
  const createAssessmentMutation = useMutation({
    mutationFn: async (assessment: Partial<Assessment>) => {
      // Normally you would use API, but we're using sample data for now
      // return apiRequest("POST", "/api/assessments", assessment);
      const newId = `A-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const newAssessment: Assessment = {
        id: newId,
        traineeId: selectedTrainee?.id || "",
        traineeName: selectedTrainee?.name || "",
        course: selectedTrainee?.course || "",
        assessmentType: assessment.assessmentType as Assessment["assessmentType"],
        assessmentDate: new Date().toISOString().split('T')[0],
        score: assessment.score || 0,
        maxScore: assessment.maxScore || 100,
        result: assessment.result as Assessment["result"],
        comments: assessment.comments || ""
      };
      
      // Add to sample data (in real app, this would be done by the server)
      sampleAssessments.push(newAssessment);
      return newAssessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments/trainee", selectedTrainee?.id] });
      setIsAddAssessmentDialogOpen(false);
      toast({
        title: "Assessment Added",
        description: "The assessment has been successfully recorded.",
      });
      // Reset form
      setNewAssessment({
        assessmentType: "Written",
        score: 0,
        maxScore: 100,
        result: "Pending",
        comments: ""
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Add Assessment",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Add training result mutation
  const createTrainingResultMutation = useMutation({
    mutationFn: async (result: Partial<TrainingResult>) => {
      // Normally you would use API, but we're using sample data for now
      // return apiRequest("POST", "/api/training-results", result);
      const newId = `TR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const certificateNumber = result.certificateIssued 
        ? `CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
        : undefined;
      
      const newTrainingResult: TrainingResult = {
        id: newId,
        traineeId: selectedTrainee?.id || "",
        traineeName: selectedTrainee?.name || "",
        course: selectedTrainee?.course || "",
        completionDate: new Date().toISOString().split('T')[0],
        overallRating: result.overallRating || 0,
        feedback: result.feedback || "",
        certificateIssued: result.certificateIssued || false,
        certificateNumber,
        issuedDate: result.certificateIssued ? new Date().toISOString().split('T')[0] : undefined,
        employmentStatus: result.employmentStatus as TrainingResult["employmentStatus"],
        employmentDetails: result.employmentDetails
      };
      
      // Add to sample data (in real app, this would be done by the server)
      sampleTrainingResults.push(newTrainingResult);
      return newTrainingResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training-results/trainee", selectedTrainee?.id] });
      setIsAddTrainingResultDialogOpen(false);
      toast({
        title: "Training Result Added",
        description: "The training result has been successfully recorded.",
      });
      // Reset form
      setNewTrainingResult({
        overallRating: 0,
        feedback: "",
        certificateIssued: false,
        employmentStatus: "Unknown"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Add Training Result",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle creating assessment
  const handleCreateAssessment = () => {
    if (!selectedTrainee) return;
    
    // Calculate result based on score percentage
    const scorePercentage = (newAssessment.score || 0) / (newAssessment.maxScore || 100) * 100;
    const calculatedResult: Assessment["result"] = 
      scorePercentage >= 75 ? "Pass" : 
      scorePercentage < 75 ? "Fail" : 
      "Pending";
    
    createAssessmentMutation.mutate({
      ...newAssessment,
      result: calculatedResult
    });
  };
  
  // Handle creating training result
  const handleCreateTrainingResult = () => {
    if (!selectedTrainee) return;
    createTrainingResultMutation.mutate(newTrainingResult);
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
              <div className="flex flex-col gap-4">
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
                
                <div className="flex items-center gap-3">
                  <Label htmlFor="courseFilter">Filter by Course:</Label>
                  <Select 
                    value={courseFilter} 
                    onValueChange={setCourseFilter}
                  >
                    <SelectTrigger id="courseFilter" className="w-[220px]">
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map(course => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                        <TableCell colSpan={8} className="text-center py-6">
                          Loading trainees...
                        </TableCell>
                      </TableRow>
                    ) : filteredTrainees?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
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
                          <TableCell>
                            {trainee.trainerName ? (
                              <span className="text-sm font-medium">{trainee.trainerName}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Not assigned</span>
                            )}
                          </TableCell>
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Trainee Details</DialogTitle>
            <DialogDescription>
              Complete information for this trainee.
            </DialogDescription>
          </DialogHeader>
          {selectedTrainee && (
            <div className="py-4">
              <div className="flex items-center mb-6">
                <Avatar className="h-20 w-20 bg-primary text-white mr-4">
                  <AvatarFallback className="text-2xl">{getInitials(selectedTrainee.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedTrainee.name}</h3>
                  <p className="text-muted-foreground">{selectedTrainee.id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(selectedTrainee.status)}
                    {getPaymentBadge(selectedTrainee.payment)}
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Profile
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="assessments" disabled={user?.role !== "pesdo_admin"}>
                    <div className="flex items-center">
                      <ClipboardCheck className="mr-2 h-4 w-4" />
                      Assessments
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="training-result" disabled={user?.role !== "pesdo_admin"}>
                    <div className="flex items-center">
                      <Award className="mr-2 h-4 w-4" />
                      Training Result
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
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
                    {selectedTrainee.trainerId && selectedTrainee.trainerName && (
                      <div className="col-span-2 mt-2 pt-2 border-t">
                        <p className="text-sm text-muted-foreground">Assigned Trainer</p>
                        <p className="font-medium">{selectedTrainee.trainerName}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="assessments" className="mt-4">
                  {assessments && assessments.length > 0 ? (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Assessment Results</h3>
                        {user?.role === "pesdo_admin" && (
                          <Button 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => setIsAddAssessmentDialogOpen(true)}
                          >
                            <Plus className="h-4 w-4" /> Add Assessment
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {assessments.map((assessment) => (
                          <Card key={assessment.id}>
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold">{assessment.assessmentType} Assessment</h4>
                                    {assessment.result === "Pass" ? (
                                      <Badge className="bg-green-100 text-green-800">Pass</Badge>
                                    ) : assessment.result === "Fail" ? (
                                      <Badge className="bg-red-100 text-red-800">Fail</Badge>
                                    ) : (
                                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(assessment.assessmentDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold">
                                    {assessment.score}/{assessment.maxScore}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {Math.round((assessment.score / assessment.maxScore) * 100)}%
                                  </div>
                                </div>
                              </div>
                              
                              {assessment.comments && (
                                <div className="mt-3 pt-3 border-t">
                                  <p className="text-sm text-muted-foreground">Comments</p>
                                  <p className="text-sm">{assessment.comments}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <h3 className="text-lg font-semibold mb-1">No Assessments Yet</h3>
                      <p className="text-muted-foreground mb-4">This trainee has no recorded assessments.</p>
                      {user?.role === "pesdo_admin" && (
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1 mx-auto"
                          onClick={() => setIsAddAssessmentDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4" /> Add First Assessment
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="training-result" className="mt-4">
                  {trainingResult ? (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Training Result</h3>
                        {user?.role === "pesdo_admin" && (
                          <Button size="sm" variant="outline">
                            Edit Result
                          </Button>
                        )}
                      </div>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">{trainingResult.course}</h4>
                              <p className="text-sm text-muted-foreground">
                                Completed on {new Date(trainingResult.completionDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold">{trainingResult.overallRating}/5.0</div>
                              <div className="text-sm text-muted-foreground">Overall Rating</div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Feedback</p>
                              <p className="text-sm">{trainingResult.feedback}</p>
                            </div>
                            
                            <div className="flex justify-between pt-3 border-t">
                              <div>
                                <p className="text-sm text-muted-foreground">Certificate Status</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {trainingResult.certificateIssued ? (
                                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                                      <Check className="h-3 w-3" /> Issued
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                                      <XCircle className="h-3 w-3" /> Not Issued
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {trainingResult.certificateIssued && (
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Certificate Number</p>
                                  <p className="font-medium">{trainingResult.certificateNumber}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Issued on {new Date(trainingResult.issuedDate || "").toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <div className="pt-3 border-t">
                              <p className="text-sm text-muted-foreground">Employment Status</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={`${
                                  trainingResult.employmentStatus === "Employed" ? "bg-green-100 text-green-800" : 
                                  trainingResult.employmentStatus === "Referred" ? "bg-blue-100 text-blue-800" : 
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {trainingResult.employmentStatus}
                                </Badge>
                              </div>
                              {trainingResult.employmentDetails && (
                                <p className="text-sm mt-1">{trainingResult.employmentDetails}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <h3 className="text-lg font-semibold mb-1">No Training Result Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        {selectedTrainee.status === "Completed" 
                          ? "This trainee has completed training but no result has been recorded."
                          : "Results will be available once training is completed."}
                      </p>
                      {user?.role === "pesdo_admin" && selectedTrainee.status === "Completed" && (
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1 mx-auto"
                          onClick={() => setIsAddTrainingResultDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4" /> Add Training Result
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Assessment Dialog */}
      <Dialog open={isAddAssessmentDialogOpen} onOpenChange={setIsAddAssessmentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Assessment</DialogTitle>
            <DialogDescription>
              Record a new assessment for {selectedTrainee?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="assessmentType">Assessment Type</Label>
              <Select
                value={newAssessment.assessmentType as string}
                onValueChange={(value) => setNewAssessment({ ...newAssessment, assessmentType: value as Assessment["assessmentType"] })}
              >
                <SelectTrigger id="assessmentType">
                  <SelectValue placeholder="Select assessment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Written">Written</SelectItem>
                  <SelectItem value="Practical">Practical</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="score">Score</Label>
                <Input 
                  id="score" 
                  type="number"
                  min="0"
                  max={newAssessment.maxScore}
                  value={newAssessment.score?.toString() || "0"}
                  onChange={(e) => setNewAssessment({ 
                    ...newAssessment, 
                    score: parseInt(e.target.value) || 0 
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxScore">Maximum Score</Label>
                <Input 
                  id="maxScore" 
                  type="number"
                  min="1"
                  value={newAssessment.maxScore?.toString() || "100"}
                  onChange={(e) => setNewAssessment({ 
                    ...newAssessment, 
                    maxScore: parseInt(e.target.value) || 100
                  })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="comments">Comments/Feedback</Label>
              <Textarea
                id="comments"
                placeholder="Provide feedback on the assessment..."
                value={newAssessment.comments || ""}
                onChange={(e) => setNewAssessment({ ...newAssessment, comments: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAssessmentDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateAssessment}
              disabled={createAssessmentMutation.isPending}
            >
              {createAssessmentMutation.isPending ? "Saving..." : "Save Assessment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Training Result Dialog */}
      <Dialog open={isAddTrainingResultDialogOpen} onOpenChange={setIsAddTrainingResultDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Training Result</DialogTitle>
            <DialogDescription>
              Record training completion result for {selectedTrainee?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="overallRating">Overall Rating (1-5)</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="overallRating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={newTrainingResult.overallRating?.toString() || "0"}
                  onChange={(e) => setNewTrainingResult({
                    ...newTrainingResult,
                    overallRating: parseFloat(e.target.value) || 0
                  })}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">out of 5.0</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="feedback">Feedback/Comments</Label>
              <Textarea
                id="feedback"
                placeholder="Provide feedback on the trainee's overall performance..."
                value={newTrainingResult.feedback || ""}
                onChange={(e) => setNewTrainingResult({ ...newTrainingResult, feedback: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="certificateIssued" className="cursor-pointer">Issue Certificate</Label>
                <input
                  type="checkbox"
                  id="certificateIssued"
                  checked={newTrainingResult.certificateIssued}
                  onChange={(e) => setNewTrainingResult({ ...newTrainingResult, certificateIssued: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-primary focus:ring-primary border-border rounded"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Certificate number will be automatically generated if issued
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <Select
                value={newTrainingResult.employmentStatus as string}
                onValueChange={(value) => setNewTrainingResult({ 
                  ...newTrainingResult, 
                  employmentStatus: value as TrainingResult["employmentStatus"] 
                })}
              >
                <SelectTrigger id="employmentStatus">
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employed">Employed</SelectItem>
                  <SelectItem value="Unemployed">Unemployed</SelectItem>
                  <SelectItem value="Referred">Referred</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(newTrainingResult.employmentStatus === "Employed" || newTrainingResult.employmentStatus === "Referred") && (
              <div className="grid gap-2">
                <Label htmlFor="employmentDetails">Employment Details</Label>
                <Input
                  id="employmentDetails"
                  placeholder={newTrainingResult.employmentStatus === "Employed" ? 
                    "Company name and position" : 
                    "Referred to which company/organization"
                  }
                  value={newTrainingResult.employmentDetails || ""}
                  onChange={(e) => setNewTrainingResult({ 
                    ...newTrainingResult, 
                    employmentDetails: e.target.value 
                  })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTrainingResultDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateTrainingResult}
              disabled={createTrainingResultMutation.isPending}
            >
              {createTrainingResultMutation.isPending ? "Saving..." : "Save Result"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
