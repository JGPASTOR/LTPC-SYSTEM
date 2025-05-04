import { StatsCard } from "@/components/dashboard/stats-card";
import { UserCheck, BookOpen, GraduationCap, Wallet, Users, FileText } from "lucide-react";

interface SummaryCardProps {
  stats: {
    totalEnrollments: number;
    activeCourses: number;
    completedTrainings: number;
    paymentCollection: string;
    activeTrainers: number;
    employmentReferrals: number;
  };
  isLoading: boolean;
}

export function SummaryCards({ stats, isLoading }: SummaryCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
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
      <StatsCard
        title="Payment Collection"
        value={stats?.paymentCollection || "₱0"}
        icon={Wallet}
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
        changeValue={15}
        changeLabel="vs. last month"
      />
      <StatsCard
        title="Active Trainers"
        value={stats?.activeTrainers || 0}
        icon={Users}
        iconBgColor="bg-pink-100"
        iconColor="text-pink-600"
        changeValue={2}
        changeLabel="vs. last month"
      />
      <StatsCard
        title="Employment Referrals"
        value={stats?.employmentReferrals || 0}
        icon={FileText}
        iconBgColor="bg-indigo-100"
        iconColor="text-indigo-600"
        changeValue={5}
        changeLabel="vs. last month"
      />
    </div>
  );
}