import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import { SummaryCards } from "./summary-cards";
import { EnrollmentChart } from "@/components/dashboard/enrollment-chart";
import { CourseDistribution } from "@/components/dashboard/course-distribution";
import { TrainingProgress, type CourseProgress } from "./training-progress";
import { AssessmentResults, type AssessmentResult } from "./assessment-results";
import { EmploymentReferrals, type EmploymentReferral } from "./employment-referrals";

// Demo data functions (in a real app, these would be API calls)
const getMonthlyEnrollmentData = () => [
  { name: "Jan", enrollments: 65 },
  { name: "Feb", enrollments: 59 },
  { name: "Mar", enrollments: 80 },
  { name: "Apr", enrollments: 81 },
  { name: "May", enrollments: 56 },
  { name: "Jun", enrollments: 55 },
  { name: "Jul", enrollments: 40 },
  { name: "Aug", enrollments: 70 },
  { name: "Sep", enrollments: 90 },
  { name: "Oct", enrollments: 110 },
  { name: "Nov", enrollments: 100 },
  { name: "Dec", enrollments: 50 },
];

const getQuarterlyEnrollmentData = () => [
  { name: "Q1", enrollments: 204 },
  { name: "Q2", enrollments: 192 },
  { name: "Q3", enrollments: 200 },
  { name: "Q4", enrollments: 260 },
];

const getYearlyEnrollmentData = () => [
  { name: "2020", enrollments: 520 },
  { name: "2021", enrollments: 650 },
  { name: "2022", enrollments: 780 },
  { name: "2023", enrollments: 856 },
  { name: "2024", enrollments: 756 },
];

const getCourseDistributionData = () => [
  { name: "Welding", value: 124 },
  { name: "Automotive", value: 85 },
  { name: "Cooking", value: 107 },
  { name: "Carpentry", value: 65 },
  { name: "Electronics", value: 92 },
  { name: "Tailoring", value: 43 },
];

const getTrainingProgressData = (): CourseProgress[] => [
  {
    id: "tp1",
    name: "Welding Technology",
    trainer: "Juan Dela Cruz",
    enrollmentCount: 28,
    capacity: 30,
    startDate: "2025-03-15",
    endDate: "2025-06-15",
    completion: 65,
    status: "Ongoing"
  },
  {
    id: "tp2",
    name: "Food Processing",
    trainer: "Maria Santos",
    enrollmentCount: 25,
    capacity: 25,
    startDate: "2025-04-01",
    endDate: "2025-07-01",
    completion: 40,
    status: "Ongoing"
  },
  {
    id: "tp3",
    name: "Automotive Servicing",
    trainer: "Roberto Reyes",
    enrollmentCount: 22,
    capacity: 25,
    startDate: "2025-01-15",
    endDate: "2025-04-15",
    completion: 100,
    status: "Completed"
  },
  {
    id: "tp4",
    name: "Electronics Servicing",
    trainer: "Elena Gomez",
    enrollmentCount: 18,
    capacity: 30,
    startDate: "2025-05-15",
    endDate: "2025-08-15",
    completion: 0,
    status: "Scheduled"
  }
];

const getAssessmentResultsData = (): AssessmentResult[] => [
  {
    id: "ar1",
    traineeName: "John Smith",
    course: "Welding Technology",
    assessmentDate: "2025-04-25",
    score: 92,
    status: "Passed",
    hasAttachment: true
  },
  {
    id: "ar2",
    traineeName: "Jane Doe",
    course: "Food Processing",
    assessmentDate: "2025-04-22",
    score: 88,
    status: "Passed",
    hasAttachment: true
  },
  {
    id: "ar3",
    traineeName: "Carlos Mendoza",
    course: "Automotive Servicing",
    assessmentDate: "2025-04-15",
    score: 65,
    status: "Failed",
    hasAttachment: true
  },
  {
    id: "ar4",
    traineeName: "Sofia Garcia",
    course: "Electronics Servicing",
    assessmentDate: "2025-04-10",
    score: 0,
    status: "Incomplete",
    hasAttachment: false
  }
];

const getEmploymentReferralsData = (): EmploymentReferral[] => [
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
    status: "Hired"
  },
  {
    id: "er3",
    traineeName: "Diana Torres",
    course: "Food Processing",
    completionDate: "2025-04-01",
    employer: "City Bakery",
    position: "Food Processor",
    status: "Pending"
  }
];

export function AdminPesdoDashboard() {
  const { toast } = useToast();

  // In a real app, these would be API queries
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/admin/stats"],
    queryFn: () => ({
      totalEnrollments: 756,
      activeCourses: 24,
      completedTrainings: 189,
      paymentCollection: "₱245,830",
      activeTrainers: 12,
      employmentReferrals: 45
    }),
  });

  // Handler functions
  const handleViewAssessment = (id: string) => {
    toast({
      title: "View Assessment",
      description: `Viewing assessment result with ID: ${id}`,
    });
  };

  const handleDownloadAssessment = (id: string) => {
    toast({
      title: "Download Assessment",
      description: `Downloading assessment result with ID: ${id}`,
    });
  };

  const handleViewReferral = (id: string) => {
    toast({
      title: "View Referral",
      description: `Viewing employment referral with ID: ${id}`,
    });
  };

  const handleEndorseReferral = (id: string) => {
    toast({
      title: "Endorse Trainee",
      description: `Endorsing trainee with referral ID: ${id}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <SummaryCards stats={stats || {}} isLoading={statsLoading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <EnrollmentChart
          monthlyData={getMonthlyEnrollmentData()}
          quarterlyData={getQuarterlyEnrollmentData()}
          yearlyData={getYearlyEnrollmentData()}
        />
        <CourseDistribution data={getCourseDistributionData()} />
      </div>

      {/* Training Progress and Assessment Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <TrainingProgress courses={getTrainingProgressData()} />
        <AssessmentResults 
          results={getAssessmentResultsData()} 
          onView={handleViewAssessment} 
          onDownload={handleDownloadAssessment}
        />
      </div>

      {/* Employment Referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmploymentReferrals 
          referrals={getEmploymentReferralsData()} 
          onView={handleViewReferral}
          onEndorse={handleEndorseReferral}
        />
      </div>
    </div>
  );
}