import { StatsCard } from "@/components/dashboard/stats-card";
import { UserCheck, BookOpen, GraduationCap, Award, ClipboardCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { EnrollmentTable, Enrollment } from "@/components/enrollments/enrollment-table";
import { UpcomingBatches, TrainingBatch } from "@/components/dashboard/upcoming-batches";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssessmentInput, Trainee } from "./assessment-input";
import { TrainingResultInput, CompletedTrainee } from "./training-result-input";

// Demo data for enrollment officer
const getRecentEnrollments = (): Enrollment[] => [
  {
    id: "enr1",
    traineeName: "John Smith",
    traineeInitials: "JS",
    courseName: "Welding Technology",
    trainerName: "Juan Dela Cruz",
    status: "Active",
    payment: "Paid"
  },
  {
    id: "enr2",
    traineeName: "Jane Doe",
    traineeInitials: "JD",
    courseName: "Food Processing",
    trainerName: "Maria Santos",
    status: "Active",
    payment: "Partial"
  },
  {
    id: "enr3",
    traineeName: "Carlos Mendoza",
    traineeInitials: "CM",
    courseName: "Automotive Servicing",
    trainerName: "Roberto Reyes",
    status: "Active",
    payment: "Unpaid"
  },
  {
    id: "enr4",
    traineeName: "Sofia Garcia",
    traineeInitials: "SG",
    courseName: "Electronics Servicing",
    trainerName: "Elena Gomez",
    status: "Completed",
    payment: "Paid"
  },
  {
    id: "enr5",
    traineeName: "Miguel Lopez",
    traineeInitials: "ML",
    courseName: "Carpentry",
    trainerName: "Pedro Reyes",
    status: "Dropped",
    payment: "Partial"
  }
];

const getUpcomingBatches = (): TrainingBatch[] => [
  {
    id: "batch1",
    title: "Welding Technology Batch 2",
    startDate: "2025-05-15",
    trainer: "Juan Dela Cruz",
    enrolled: 18,
    capacity: 30
  },
  {
    id: "batch2",
    title: "Food Processing Batch 3",
    startDate: "2025-05-20",
    trainer: "Maria Santos",
    enrolled: 12,
    capacity: 25
  },
  {
    id: "batch3",
    title: "Basic Computer Programming",
    startDate: "2025-06-01",
    trainer: "Elena Gomez",
    enrolled: 15,
    capacity: 20
  }
];

// Sample trainees for assessment input
const getActiveTrainees = (): Trainee[] => [
  {
    id: "T-2023-0124",
    name: "Juan Dela Cruz",
    course: "Web Development"
  },
  {
    id: "T-2023-0125",
    name: "Maria Santos",
    course: "Baking & Pastry Arts"
  },
  {
    id: "T-2023-0126",
    name: "Pedro Reyes",
    course: "Electrical Installation"
  },
  {
    id: "T-2023-0127",
    name: "Ana Lim",
    course: "Dressmaking"
  },
  {
    id: "T-2023-0128",
    name: "Roberto Aquino",
    course: "Computer Servicing"
  }
];

// Sample completed trainees for training result input
const getCompletedTrainees = (): CompletedTrainee[] => [
  {
    id: "T-2023-0129",
    name: "Elena Torres",
    course: "Culinary Arts",
    completionDate: "2023-08-01"
  },
  {
    id: "T-2023-0130",
    name: "Carlos Rivera",
    course: "Automotive Servicing",
    completionDate: "2023-07-15"
  },
  {
    id: "T-2023-0131",
    name: "Sofia Mendoza",
    course: "Welding Technology",
    completionDate: "2023-08-05"
  },
  {
    id: "T-2023-0132",
    name: "Miguel Santos",
    course: "Electronics Servicing",
    completionDate: "2023-07-30"
  }
];

export function EnrollmentOfficerDashboard() {
  const { toast } = useToast();

  // In a real app, these would be API queries
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/enrollment/stats"],
    queryFn: () => ({
      totalEnrollments: 756,
      activeCourses: 24,
      completedTrainings: 189,
    }),
  });

  const handleViewEnrollment = (id: string) => {
    toast({
      title: "View Enrollment",
      description: `Viewing enrollment with ID: ${id}`,
    });
  };

  const handleEditEnrollment = (id: string) => {
    toast({
      title: "Edit Enrollment",
      description: `Editing enrollment with ID: ${id}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Total Enrollments"
          value={stats?.totalEnrollments || 0}
          icon={UserCheck}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          changeValue={12}
          changeLabel="vs. last month"
        />
        <StatsCard
          title="Active Courses"
          value={stats?.activeCourses || 0}
          icon={BookOpen}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          changeValue={3}
          changeLabel="vs. last month"
        />
        <StatsCard
          title="Completed Trainings"
          value={stats?.completedTrainings || 0}
          icon={GraduationCap}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          changeValue={8}
          changeLabel="vs. last month"
        />
      </div>

      {/* Enrollments Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Enrollments</h2>
        <EnrollmentTable
          enrollments={getRecentEnrollments()}
          onView={handleViewEnrollment}
          onEdit={handleEditEnrollment}
        />
      </div>
      
      {/* Upcoming Batches */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Batches</h2>
        <UpcomingBatches batches={getUpcomingBatches()} />
      </div>
      
      {/* Assessment and Training Results Input Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Record Training Results & Assessments</h2>
        <Tabs defaultValue="assessment" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="assessment" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" /> Assessments
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <Award className="h-4 w-4" /> Training Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assessment">
            <AssessmentInput trainees={getActiveTrainees()} />
          </TabsContent>
          
          <TabsContent value="training">
            <TrainingResultInput completedTrainees={getCompletedTrainees()} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}