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
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

// Define trainer interface for selection in course assignment
interface Trainer {
  id: string;
  name: string;
  expertise: string;
}

// Define course interface
interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  status: "Active" | "Inactive";
  enrollmentCount: number;
  trainers?: Trainer[];  // Array of assigned trainers
}

// Sample courses data
const sampleCourses: Course[] = [
  {
    id: "C001",
    name: "Web Development",
    description: "Learn HTML, CSS, JavaScript and React",
    duration: "12 weeks",
    status: "Active",
    enrollmentCount: 24
  },
  {
    id: "C002",
    name: "Culinary Arts",
    description: "Basic cooking techniques and recipes",
    duration: "8 weeks",
    status: "Active",
    enrollmentCount: 18
  },
  {
    id: "C003",
    name: "Dressmaking",
    description: "Learn to create and alter clothing",
    duration: "10 weeks",
    status: "Active",
    enrollmentCount: 15
  },
  {
    id: "C004",
    name: "Electrical Installation",
    description: "Residential and commercial electrical wiring",
    duration: "14 weeks",
    status: "Active",
    enrollmentCount: 22
  },
  {
    id: "C005",
    name: "Baking & Pastry Arts",
    description: "Learn to bake bread, cakes and desserts",
    duration: "6 weeks",
    status: "Active",
    enrollmentCount: 20
  },
  {
    id: "C006",
    name: "Computer Servicing",
    description: "Hardware and software troubleshooting",
    duration: "8 weeks",
    status: "Inactive",
    enrollmentCount: 0
  }
];

// Sample trainers for dropdown
const sampleAvailableTrainers: Trainer[] = [
  { id: "TR001", name: "Maria Reyes", expertise: "Web Development" },
  { id: "TR002", name: "Pedro Santos", expertise: "Culinary Arts" },
  { id: "TR003", name: "Lisa Garcia", expertise: "Dressmaking" },
  { id: "TR004", name: "Manuel Tan", expertise: "Electrical Installation" },
  { id: "TR005", name: "Ana Lim", expertise: "Baking & Pastry Arts" },
  { id: "TR006", name: "Roberto Aquino", expertise: "Computer Servicing" }
];

export default function CoursesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { toast } = useToast();
  
  // Selected trainers for new course
  const [selectedTrainers, setSelectedTrainers] = useState<Trainer[]>([]);
  
  // Selected trainers for edit course
  const [editSelectedTrainers, setEditSelectedTrainers] = useState<Trainer[]>([]);

  // Form state for new course
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    duration: "",
    status: "Active" as Course["status"],
    trainers: [] as Trainer[]
  });

  // Form state for edit course
  const [editCourse, setEditCourse] = useState({
    id: "",
    name: "",
    description: "",
    duration: "",
    status: "Active" as Course["status"],
    trainers: [] as Trainer[]
  });

  // Fetch courses
  const { data: courses, isLoading } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: () => sampleCourses,
  });

  // Filter courses based on search query
  const filteredCourses = courses?.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle trainer selection for new course
  const handleTrainerSelect = (trainerId: string, isSelected: boolean) => {
    if (isSelected) {
      // Add trainer to the selected list
      const trainerToAdd = sampleAvailableTrainers.find(t => t.id === trainerId);
      if (trainerToAdd) {
        setSelectedTrainers([...selectedTrainers, trainerToAdd]);
        setNewCourse({
          ...newCourse,
          trainers: [...selectedTrainers, trainerToAdd]
        });
      }
    } else {
      // Remove trainer from the selected list
      const updatedTrainers = selectedTrainers.filter(t => t.id !== trainerId);
      setSelectedTrainers(updatedTrainers);
      setNewCourse({
        ...newCourse,
        trainers: updatedTrainers
      });
    }
  };
  
  // Handle trainer selection for edit course
  const handleEditTrainerSelect = (trainerId: string, isSelected: boolean) => {
    if (isSelected) {
      // Add trainer to the selected list
      const trainerToAdd = sampleAvailableTrainers.find(t => t.id === trainerId);
      if (trainerToAdd) {
        setEditSelectedTrainers([...editSelectedTrainers, trainerToAdd]);
        setEditCourse({
          ...editCourse,
          trainers: [...editSelectedTrainers, trainerToAdd]
        });
      }
    } else {
      // Remove trainer from the selected list
      const updatedTrainers = editSelectedTrainers.filter(t => t.id !== trainerId);
      setEditSelectedTrainers(updatedTrainers);
      setEditCourse({
        ...editCourse,
        trainers: updatedTrainers
      });
    }
  };

  // Handle creating a new course
  const handleCreateCourse = () => {
    // Create the course with the selected trainers
    const courseWithTrainers = {
      ...newCourse,
      trainers: selectedTrainers
    };
    
    toast({
      title: "Course Created",
      description: `Course "${newCourse.name}" has been created successfully with ${selectedTrainers.length} assigned trainers.`,
    });
    
    setIsAddDialogOpen(false);
    // Reset the form
    setNewCourse({
      name: "",
      description: "",
      duration: "",
      status: "Active" as Course["status"],
      trainers: []
    });
    setSelectedTrainers([]);
  };

  // Handle editing a course
  const handleEditCourse = () => {
    // Update the course with the selected trainers
    const updatedCourse = {
      ...editCourse,
      trainers: editSelectedTrainers
    };
    
    toast({
      title: "Course Updated",
      description: `Course "${editCourse.name}" has been updated successfully with ${editSelectedTrainers.length} assigned trainers.`,
    });
    
    setIsEditDialogOpen(false);
    setEditSelectedTrainers([]);
  };

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Handle opening edit dialog
  const openEditDialog = (course: Course) => {
    setSelectedCourse(course);
    // Set the trainers if they exist in the course
    if (course.trainers && course.trainers.length > 0) {
      setEditSelectedTrainers(course.trainers);
    } else {
      setEditSelectedTrainers([]);
    }
    
    setEditCourse({
      id: course.id,
      name: course.name,
      description: course.description,
      duration: course.duration,
      status: course.status,
      trainers: course.trainers || []
    });
    
    setIsEditDialogOpen(true);
  };

  // Handle delete course
  const handleDeleteCourse = (id: string) => {
    toast({
      title: "Course Deleted",
      description: `Course with ID "${id}" has been deleted.`,
      variant: "destructive",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {isSidebarOpen && <Sidebar />}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Courses Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Courses Management</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add New Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                  <DialogDescription>
                    Create a new training course in the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Course Name</Label>
                    <Input
                      id="name"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      placeholder="Enter course name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      placeholder="Enter course description"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                      placeholder="e.g. 8 weeks"
                    />
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="grid gap-2">
                    <Label>Assign Trainers</Label>
                    <div className="max-h-60 overflow-y-auto border rounded-md p-3 grid gap-2">
                      {sampleAvailableTrainers.map((trainer) => (
                        <div key={trainer.id} className="flex items-center gap-3 py-1">
                          <Checkbox 
                            id={`trainer-${trainer.id}`}
                            checked={selectedTrainers.some(t => t.id === trainer.id)}
                            onCheckedChange={(checked) => handleTrainerSelect(trainer.id, !!checked)}
                          />
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 bg-primary text-white">
                              <AvatarFallback>{getInitials(trainer.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <Label className="text-sm font-medium" htmlFor={`trainer-${trainer.id}`}>
                                {trainer.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {trainer.expertise}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedTrainers.length > 0 
                        ? `${selectedTrainers.length} trainer${selectedTrainers.length > 1 ? 's' : ''} selected` 
                        : 'No trainers selected'}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateCourse}>Create Course</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>All Courses</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    className="pl-10"
                    placeholder="Search courses..."
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
                      <TableHead>Description</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrollments</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          Loading courses...
                        </TableCell>
                      </TableRow>
                    ) : filteredCourses?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No courses found. Try a different search term.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCourses?.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.id}</TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell className="max-w-sm truncate">{course.description}</TableCell>
                          <TableCell>{course.duration}</TableCell>
                          <TableCell>
                            {course.status === "Active" ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>{course.enrollmentCount}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(course)}
                              >
                                <Edit className="h-4 w-4 text-secondary" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
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
      
      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update the course information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-id">Course ID</Label>
              <Input
                id="edit-id"
                value={editCourse.id}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Course Name</Label>
              <Input
                id="edit-name"
                value={editCourse.name}
                onChange={(e) => setEditCourse({ ...editCourse, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editCourse.description}
                onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-duration">Duration</Label>
              <Input
                id="edit-duration"
                value={editCourse.duration}
                onChange={(e) => setEditCourse({ ...editCourse, duration: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                className="form-select block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                value={editCourse.status}
                onChange={(e) => setEditCourse({ ...editCourse, status: e.target.value as Course["status"] })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid gap-2">
              <Label>Assigned Trainers</Label>
              <div className="max-h-60 overflow-y-auto border rounded-md p-3 grid gap-2">
                {sampleAvailableTrainers.map((trainer) => (
                  <div key={trainer.id} className="flex items-center gap-3 py-1">
                    <Checkbox 
                      id={`edit-trainer-${trainer.id}`}
                      checked={editSelectedTrainers.some(t => t.id === trainer.id)}
                      onCheckedChange={(checked) => handleEditTrainerSelect(trainer.id, !!checked)}
                    />
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 bg-primary text-white">
                        <AvatarFallback>{getInitials(trainer.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Label className="text-sm font-medium" htmlFor={`edit-trainer-${trainer.id}`}>
                          {trainer.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {trainer.expertise}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {editSelectedTrainers.length > 0 
                  ? `${editSelectedTrainers.length} trainer${editSelectedTrainers.length > 1 ? 's' : ''} assigned` 
                  : 'No trainers assigned'}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCourse}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
