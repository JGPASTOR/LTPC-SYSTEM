import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Loader2, Search, Plus, Edit, FileCheck, Briefcase, Phone } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define employment referral interface
interface EmploymentReferral {
  id: string;
  traineeName: string;
  course: string;
  completionDate: string;
  employer: string;
  position: string;
  status: "Endorsed" | "Hired";
  contactDetails?: string;
  notes?: string;
}

// Sample data
const sampleReferrals: EmploymentReferral[] = [
  {
    id: "er1",
    traineeName: "Anna Cruz",
    course: "Welding Technology",
    completionDate: "2025-03-30",
    employer: "ABC Manufacturing",
    position: "Junior Welder",
    status: "Endorsed"
  },
  {
    id: "er2",
    traineeName: "Marco Santos",
    course: "Automotive Servicing",
    completionDate: "2025-03-25",
    employer: "XYZ Auto Shop",
    position: "Mechanic Assistant",
    status: "Hired",
    contactDetails: "09123456789",
    notes: "Started work on April 5, 2025. Initial feedback from employer is positive."
  },
  {
    id: "er3",
    traineeName: "Diana Torres",
    course: "Food Processing",
    completionDate: "2025-04-01",
    employer: "City Bakery",
    position: "Food Processor",
    status: "Pending"
  },
  {
    id: "er4",
    traineeName: "Luis Mendoza",
    course: "Computer Servicing",
    completionDate: "2025-03-15",
    employer: "TechSolutions Inc.",
    position: "Computer Technician",
    status: "Not Qualified",
    notes: "Needs additional training in networking before reapplying."
  },
  {
    id: "er5",
    traineeName: "Maria Reyes",
    course: "Dressmaking",
    completionDate: "2025-04-05",
    employer: "Fashion Forward",
    position: "Assistant Tailor",
    status: "Endorsed",
    contactDetails: "09789456123"
  }
];

// Form schema for referral
const referralSchema = z.object({
  traineeName: z.string().min(1, "Trainee name is required"),
  course: z.string().min(1, "Course is required"),
  completionDate: z.string().min(1, "Completion date is required"),
  employer: z.string().min(1, "Employer name is required"),
  position: z.string().min(1, "Position is required"),
  status: z.enum(["Endorsed", "Hired"]),
  contactDetails: z.string().optional(),
  notes: z.string().optional()
});

type ReferralFormValues = z.infer<typeof referralSchema>;

// Status badge component
const StatusBadge = ({ status }: { status: EmploymentReferral["status"] }) => {
  const getVariant = () => {
    switch (status) {
      case "Hired": return "success";
      case "Endorsed": return "outline";
      case "Pending": return "secondary";
      case "Not Qualified": return "destructive";
      default: return "outline";
    }
  };
  
  return (
    <Badge variant={getVariant() as any}>
      {status}
    </Badge>
  );
};

export default function EmploymentReferralsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<EmploymentReferral | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch referrals data
  const { data: referrals = [], isLoading } = useQuery({
    queryKey: ["/api/employment-referrals"],
    queryFn: () => sampleReferrals
  });

  // Filter referrals based on search query
  const filteredReferrals = referrals.filter(
    (referral) =>
      referral.traineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.employer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form setup for adding/editing referrals
  const form = useForm<ReferralFormValues>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      traineeName: "",
      course: "",
      completionDate: new Date().toISOString().split('T')[0],
      employer: "",
      position: "",
      status: "Pending",
      contactDetails: "",
      notes: ""
    }
  });

  // Mutation for creating referral
  const createReferralMutation = useMutation({
    mutationFn: async (values: ReferralFormValues) => {
      // In a real app, this would be an API call
      console.log("Creating referral:", values);
      return { id: `er-${Date.now().toString().slice(-5)}`, ...values };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employment-referrals"] });
      toast({
        title: "Referral Created",
        description: "Employment referral has been successfully created",
      });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Create Referral",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for updating referral status
  const updateReferralStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: EmploymentReferral["status"] }) => {
      // In a real app, this would be an API call
      console.log(`Updating referral ${id} status to ${status}`);
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employment-referrals"] });
      toast({
        title: "Status Updated",
        description: "Referral status has been successfully updated",
      });
      setIsViewDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Update Status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handler for viewing a referral
  const handleViewReferral = (referral: EmploymentReferral) => {
    setSelectedReferral(referral);
    setIsViewDialogOpen(true);
  };

  // Handler for creating a new referral
  const handleSubmitReferral = (values: ReferralFormValues) => {
    createReferralMutation.mutate(values);
  };

  // Handler for updating status
  const handleUpdateStatus = (status: EmploymentReferral["status"]) => {
    if (selectedReferral) {
      updateReferralStatusMutation.mutate({ id: selectedReferral.id, status });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {isSidebarOpen && <Sidebar />}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Title */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Employment Referrals</h1>
            
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Referral
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search referrals by trainee name, employer, position or course..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Referrals Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Referrals</CardTitle>
              <CardDescription>
                Management of trainee employment referrals and placement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredReferrals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No referrals found matching your search criteria
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trainee</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Employer</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReferrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>{referral.traineeName}</TableCell>
                        <TableCell>{referral.course}</TableCell>
                        <TableCell>{referral.employer}</TableCell>
                        <TableCell>{referral.position}</TableCell>
                        <TableCell>
                          <StatusBadge status={referral.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewReferral(referral)}
                          >
                            <FileCheck className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          {/* Add Referral Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Employment Referral</DialogTitle>
                <DialogDescription>
                  Create a new employment referral for a graduated trainee
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitReferral)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="traineeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trainee Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="completionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Completion Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="employer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employer</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Endorsed">Endorsed</SelectItem>
                            <SelectItem value="Hired">Hired</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Not Qualified">Not Qualified</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Details</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Phone number or email for follow-up
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="resize-none" 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createReferralMutation.isPending}
                    >
                      {createReferralMutation.isPending ? "Saving..." : "Save Referral"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          {/* View Referral Dialog */}
          {selectedReferral && (
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Referral Details</DialogTitle>
                  <DialogDescription>
                    Employment referral information for {selectedReferral.traineeName}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Trainee Name
                      </h4>
                      <p className="font-medium">{selectedReferral.traineeName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Course
                      </h4>
                      <p>{selectedReferral.course}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Completion Date
                      </h4>
                      <p>{new Date(selectedReferral.completionDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Current Status
                      </h4>
                      <StatusBadge status={selectedReferral.status} />
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Employment Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <h5 className="text-sm text-muted-foreground mb-1">Employer</h5>
                        <p className="font-medium">{selectedReferral.employer}</p>
                      </div>
                      <div>
                        <h5 className="text-sm text-muted-foreground mb-1">Position</h5>
                        <p>{selectedReferral.position}</p>
                      </div>
                    </div>
                    
                    {selectedReferral.contactDetails && (
                      <div className="flex items-center mt-2 mb-2">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{selectedReferral.contactDetails}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedReferral.notes && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Notes
                      </h4>
                      <p className="text-sm">{selectedReferral.notes}</p>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">
                      Update Status
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedReferral.status === "Endorsed" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleUpdateStatus("Endorsed")}
                      >
                        Endorsed
                      </Button>
                      <Button
                        variant={selectedReferral.status === "Hired" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleUpdateStatus("Hired")}
                      >
                        Hired
                      </Button>
                      <Button
                        variant={selectedReferral.status === "Pending" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleUpdateStatus("Pending")}
                      >
                        Pending
                      </Button>
                      <Button
                        variant={selectedReferral.status === "Not Qualified" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleUpdateStatus("Not Qualified")}
                      >
                        Not Qualified
                      </Button>
                    </div>
                  </div>
                  
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" /> Edit Referral
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </div>
    </div>
  );
}