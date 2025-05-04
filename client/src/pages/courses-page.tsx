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

// Define course interface
interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  status: "Active" | "Inactive";
  enrollmentCount: number;
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

export default function CoursesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  // Form state for new course
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    duration: "",
    status: "Active" as Course["status"]
  });

  // Form state for edit course
  const [editCourse, setEditCourse] = useState({
    id: "",
    name: "",
    description: "",
    duration: "",
    status: "Active" as Course["status"]
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

  // Handle creating a new course
  const handleCreateCourse = () => {
    toast({
      title: "Course Created",
      description: `Course "${newCourse.name}" has been created successfully.`,
    });
    setIsAddDialogOpen(false);
    setNewCourse({
      name: "",
      description: "",
      duration: "",
      status: "Active"
    });
  };

  // Handle editing a course
  const handleEditCourse = () => {
    toast({
      title: "Course Updated",
      description: `Course "${editCourse.name}" has been updated successfully.`,
    });
    setIsEditDialogOpen(false);
  };

  // Handle opening edit dialog
  const openEditDialog = (course: Course) => {
    setSelectedCourse(course);
    setEditCourse({
      id: course.id,
      name: course.name,
      description: course.description,
      duration: course.duration,
      status: course.status
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
