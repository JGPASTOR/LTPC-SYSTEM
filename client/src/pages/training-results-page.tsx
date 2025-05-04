import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { 
  Loader2, 
  Search, 
  Award, 
  Download, 
  Eye, 
  Filter, 
  FileText, 
  Star, 
  CheckCircle,
  Briefcase,
  Calendar
} from "lucide-react";

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

// Sample data
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
  },
  {
    id: "TR-002",
    traineeId: "T-2023-0130",
    traineeName: "Carlos Rivera",
    course: "Automotive Servicing",
    completionDate: "2023-07-15",
    overallRating: 4.2,
    feedback: "Carlos demonstrated good technical knowledge and problem-solving skills throughout the course. He needs more practice with modern diagnostic tools.",
    certificateIssued: true,
    certificateNumber: "CERT-2023-0002",
    issuedDate: "2023-07-20",
    employmentStatus: "Referred",
    employmentDetails: "Referred to Metro Auto Center"
  },
  {
    id: "TR-003",
    traineeId: "T-2023-0131",
    traineeName: "Sofia Mendoza",
    course: "Welding Technology",
    completionDate: "2023-08-05",
    overallRating: 4.5,
    feedback: "Sofia has excellent welding skills and attention to detail. She consistently produced high-quality work.",
    certificateIssued: true,
    certificateNumber: "CERT-2023-0003",
    issuedDate: "2023-08-10",
    employmentStatus: "Employed",
    employmentDetails: "Hired as Junior Welder at Industrial Systems Inc."
  },
  {
    id: "TR-004",
    traineeId: "T-2023-0132",
    traineeName: "Miguel Santos",
    course: "Electronics Servicing",
    completionDate: "2023-07-30",
    overallRating: 3.7,
    feedback: "Miguel has good theoretical knowledge but needs more hands-on practice. His troubleshooting skills improved significantly over the course.",
    certificateIssued: true,
    certificateNumber: "CERT-2023-0004",
    issuedDate: "2023-08-05",
    employmentStatus: "Unemployed"
  },
  {
    id: "TR-005",
    traineeId: "T-2023-0133",
    traineeName: "Ana Reyes",
    course: "Dressmaking",
    completionDate: "2023-08-10",
    overallRating: 4.9,
    feedback: "Ana demonstrated exceptional creativity and craftsmanship. Her final project exceeded expectations in quality and design.",
    certificateIssued: false,
    employmentStatus: "Unknown"
  }
];

// Employment status badge component
const EmploymentBadge = ({ status }: { status: TrainingResult["employmentStatus"] }) => {
  switch (status) {
    case "Employed":
      return <Badge variant="success" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        <span>Employed</span>
      </Badge>;
    case "Referred":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 flex items-center gap-1">
        <Briefcase className="h-3 w-3" />
        <span>Referred</span>
      </Badge>;
    case "Unemployed":
      return <Badge variant="destructive" className="flex items-center gap-1">
        <span>Unemployed</span>
      </Badge>;
    case "Unknown":
      return <Badge variant="secondary" className="flex items-center gap-1">
        <span>Unknown</span>
      </Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Certificate badge component
const CertificateBadge = ({ issued }: { issued: boolean }) => {
  return issued 
    ? <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        <span>Certificate Issued</span>
      </Badge>
    : <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 flex items-center gap-1">
        <span>Pending</span>
      </Badge>;
};

// Rating component
const StarRating = ({ rating }: { rating: number }) => {
  // Round to nearest half
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const halfStar = roundedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return (
    <div className="flex items-center">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      
      {/* Half star */}
      {halfStar && (
        <span className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <Star className="absolute top-0 h-4 w-4 fill-yellow-400 overflow-hidden" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
        </span>
      )}
      
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
      
      <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

export default function TrainingResultsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEmployment, setFilterEmployment] = useState<string | null>(null);
  const [filterCertificate, setFilterCertificate] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<TrainingResult | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch training results data
  const { data: trainingResults = [], isLoading } = useQuery({
    queryKey: ["/api/training-results"],
    queryFn: () => sampleTrainingResults
  });

  // Filter results based on search query and filters
  const filteredResults = trainingResults.filter((result) => {
    // Apply search query filter
    const matchesSearch = result.traineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply employment status filter if selected
    const matchesEmployment = !filterEmployment || 
      filterEmployment === "all_statuses" || 
      result.employmentStatus === filterEmployment;
    
    // Apply certificate filter if selected
    const matchesCertificate = !filterCertificate || 
      filterCertificate === "all_certificates" ||
      (filterCertificate === "issued" && result.certificateIssued) ||
      (filterCertificate === "pending" && !result.certificateIssued);
    
    return matchesSearch && matchesEmployment && matchesCertificate;
  });

  // Handler for viewing a training result
  const handleViewResult = (result: TrainingResult) => {
    setSelectedResult(result);
    setIsViewDialogOpen(true);
  };

  // Handler for downloading a certificate
  const handleDownloadCertificate = (id: string, certificateNumber: string) => {
    toast({
      title: "Download Started",
      description: `Certificate ${certificateNumber} is being downloaded.`,
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterEmployment(null);
    setFilterCertificate(null);
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
            <h1 className="text-3xl font-bold">Training Results</h1>
            
            <Button variant="outline" onClick={handleResetFilters} disabled={!filterEmployment && !filterCertificate && !searchQuery}>
              Reset Filters
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by trainee, course or result ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filterEmployment || ""} onValueChange={(value) => setFilterEmployment(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {filterEmployment ? `${filterEmployment}` : "Employment Status"}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_statuses">All Statuses</SelectItem>
                  <SelectItem value="Employed">Employed</SelectItem>
                  <SelectItem value="Unemployed">Unemployed</SelectItem>
                  <SelectItem value="Referred">Referred</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterCertificate || ""} onValueChange={(value) => setFilterCertificate(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    {filterCertificate === "issued" ? "Certificate Issued" : 
                     filterCertificate === "pending" ? "Certificate Pending" : 
                     "Certificate Status"}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_certificates">All Certificates</SelectItem>
                  <SelectItem value="issued">Issued</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Training Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>Training Results</CardTitle>
              <CardDescription>
                View trainee completion results across different courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No training results found matching your search criteria
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Trainee</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Certificate</TableHead>
                      <TableHead>Employment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.id}</TableCell>
                        <TableCell>{result.traineeName}</TableCell>
                        <TableCell>{result.course}</TableCell>
                        <TableCell>{new Date(result.completionDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <StarRating rating={result.overallRating} />
                        </TableCell>
                        <TableCell>
                          <CertificateBadge issued={result.certificateIssued} />
                        </TableCell>
                        <TableCell>
                          <EmploymentBadge status={result.employmentStatus} />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewResult(result)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {result.certificateIssued && result.certificateNumber && (
                                <DropdownMenuItem onClick={() => handleDownloadCertificate(result.id, result.certificateNumber!)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Certificate
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
          
          {/* View Training Result Dialog */}
          {selectedResult && (
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Training Result Details</DialogTitle>
                  <DialogDescription>
                    Training completion information for {selectedResult.traineeName}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Result ID
                      </h4>
                      <p className="font-medium">{selectedResult.id}</p>
                    </div>
                    <div className="flex items-center">
                      <StarRating rating={selectedResult.overallRating} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Trainee
                      </h4>
                      <p className="font-medium">{selectedResult.traineeName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Course
                      </h4>
                      <p>{selectedResult.course}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Completion Date
                      </h4>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p>{new Date(selectedResult.completionDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Employment Status
                      </h4>
                      <EmploymentBadge status={selectedResult.employmentStatus} />
                    </div>
                  </div>
                  
                  {/* Certificate Information */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Certificate Information
                    </h4>
                    
                    <div className="bg-muted p-3 rounded-md">
                      {selectedResult.certificateIssued ? (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Certificate Number:</span>
                            <span className="text-sm">{selectedResult.certificateNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Issue Date:</span>
                            <span className="text-sm">{selectedResult.issuedDate ? new Date(selectedResult.issuedDate).toLocaleDateString() : "N/A"}</span>
                          </div>
                          <div className="text-center pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => selectedResult.certificateNumber && handleDownloadCertificate(selectedResult.id, selectedResult.certificateNumber)}
                            >
                              <Download className="h-4 w-4 mr-2" /> Download Certificate
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground p-2">
                          Certificate has not been issued yet
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Employment Information */}
                  {(selectedResult.employmentStatus === "Employed" || selectedResult.employmentStatus === "Referred") && selectedResult.employmentDetails && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Employment Details
                      </h4>
                      <p className="text-sm">{selectedResult.employmentDetails}</p>
                    </div>
                  )}
                  
                  {/* Feedback Information */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Training Feedback
                    </h4>
                    <p className="text-sm">{selectedResult.feedback}</p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close
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