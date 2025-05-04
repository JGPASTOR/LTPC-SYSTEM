import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Loader2, Search, FileText, Download, Eye, Filter, CheckCircle, BookOpen } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

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
  hasAttachment?: boolean;
}

// Sample data
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
    comments: "Good understanding of HTML and CSS concepts.",
    hasAttachment: true
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
    comments: "Excellent implementation of responsive design principles.",
    hasAttachment: true
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
    comments: "Outstanding culinary skills demonstrated in final cooking competition.",
    hasAttachment: true
  },
  {
    id: "A-004",
    traineeId: "T-2023-0125",
    traineeName: "Maria Santos",
    course: "Baking & Pastry Arts",
    assessmentType: "Project",
    assessmentDate: "2023-06-20",
    score: 78,
    maxScore: 100,
    result: "Pass",
    comments: "Good baking techniques, but needs improvement in decoration skills.",
    hasAttachment: false
  },
  {
    id: "A-005",
    traineeId: "T-2023-0126",
    traineeName: "Pedro Reyes",
    course: "Electrical Installation",
    assessmentType: "Practical",
    assessmentDate: "2023-06-25",
    score: 65,
    maxScore: 100,
    result: "Fail",
    comments: "Needs more practice in wiring installations. Safety protocols not followed properly.",
    hasAttachment: true
  }
];

// Result badge component
const ResultBadge = ({ result }: { result: Assessment["result"] }) => {
  switch (result) {
    case "Pass":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        <span>Pass</span>
      </Badge>;
    case "Fail":
      return <Badge variant="destructive">Fail</Badge>;
    case "Pending":
      return <Badge variant="secondary">Pending</Badge>;
    default:
      return <Badge variant="outline">{result}</Badge>;
  }
};

// Assessment type badge component
const TypeBadge = ({ type }: { type: Assessment["assessmentType"] }) => {
  switch (type) {
    case "Written":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Written</Badge>;
    case "Practical":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Practical</Badge>;
    case "Project":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Project</Badge>;
    case "Final":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">Final</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

export default function AssessmentResultsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterResult, setFilterResult] = useState<string | null>(null);
  const [filterCourse, setFilterCourse] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch assessments data
  const { data: assessments = [], isLoading } = useQuery({
    queryKey: ["/api/assessments"],
    queryFn: () => sampleAssessments
  });

  // Filter assessments based on search query and filters
  const filteredAssessments = assessments.filter((assessment) => {
    // Apply search query filter
    const matchesSearch = assessment.traineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply type filter if selected
    const matchesType = !filterType || 
      filterType === "all_types" || 
      assessment.assessmentType === filterType;
    
    // Apply result filter if selected
    const matchesResult = !filterResult || 
      filterResult === "all_results" || 
      assessment.result === filterResult;
    
    // Apply course filter if selected
    const matchesCourse = !filterCourse ||
      filterCourse === "all_courses" ||
      assessment.course === filterCourse;
    
    return matchesSearch && matchesType && matchesResult && matchesCourse;
  });

  // Handler for viewing an assessment
  const handleViewAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setIsViewDialogOpen(true);
  };

  // Handler for downloading an assessment
  const handleDownloadAssessment = (id: string) => {
    toast({
      title: "Download Started",
      description: `Assessment ${id} is being downloaded.`,
    });
  };

  // Calculate score percentage
  const calculateScorePercentage = (score: number, maxScore: number) => {
    return (score / maxScore) * 100;
  };

  // Get unique courses for the filter dropdown
  const uniqueCourses = Array.from(new Set(assessments.map(assessment => assessment.course)));

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterType(null);
    setFilterResult(null);
    setFilterCourse(null);
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
            <h1 className="text-3xl font-bold">Assessment Results</h1>
            
            <Button variant="outline" onClick={handleResetFilters} disabled={!filterType && !filterResult && !filterCourse && !searchQuery}>
              Reset Filters
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by trainee, course or assessment ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Course Filter */}
              <Select value={filterCourse || ""} onValueChange={(value) => setFilterCourse(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {filterCourse ? `${filterCourse}` : "Filter by Program"}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_courses">All Programs</SelectItem>
                  {uniqueCourses.map(course => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={filterType || ""} onValueChange={(value) => setFilterType(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {filterType || "Filter by Type"}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_types">All Types</SelectItem>
                  <SelectItem value="Written">Written</SelectItem>
                  <SelectItem value="Practical">Practical</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Result Filter */}
              <Select value={filterResult || ""} onValueChange={(value) => setFilterResult(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {filterResult || "Filter by Result"}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_results">All Results</SelectItem>
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Fail">Fail</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Assessments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Results</CardTitle>
              <CardDescription>
                View trainee assessment results across different courses and assessment types
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredAssessments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No assessments found matching your search criteria
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Trainee</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">{assessment.id}</TableCell>
                        <TableCell>{assessment.traineeName}</TableCell>
                        <TableCell>{assessment.course}</TableCell>
                        <TableCell><TypeBadge type={assessment.assessmentType} /></TableCell>
                        <TableCell>{new Date(assessment.assessmentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {Math.round(assessment.score)}
                          </span>
                        </TableCell>
                        <TableCell><ResultBadge result={assessment.result} /></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewAssessment(assessment)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {assessment.hasAttachment && (
                                <DropdownMenuItem onClick={() => handleDownloadAssessment(assessment.id)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          {/* View Assessment Dialog */}
          {selectedAssessment && (
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Assessment Details</DialogTitle>
                  <DialogDescription>
                    Assessment information for {selectedAssessment.traineeName}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Assessment ID
                      </h4>
                      <p className="font-medium">{selectedAssessment.id}</p>
                    </div>
                    <TypeBadge type={selectedAssessment.assessmentType} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Trainee
                      </h4>
                      <p className="font-medium">{selectedAssessment.traineeName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Course
                      </h4>
                      <p>{selectedAssessment.course}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Assessment Date
                      </h4>
                      <p>{new Date(selectedAssessment.assessmentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Result
                      </h4>
                      <ResultBadge result={selectedAssessment.result} />
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Grade
                    </h4>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-xl">
                        {Math.round(selectedAssessment.score)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        out of {selectedAssessment.maxScore} ({calculateScorePercentage(selectedAssessment.score, selectedAssessment.maxScore).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Comments
                    </h4>
                    <p className="text-sm">{selectedAssessment.comments}</p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close
                  </Button>
                  {selectedAssessment.hasAttachment && (
                    <Button onClick={() => handleDownloadAssessment(selectedAssessment.id)}>
                      <Download className="h-4 w-4 mr-2" /> Download Assessment
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </div>
    </div>
  );
}