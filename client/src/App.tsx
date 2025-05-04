import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import DashboardPage from "@/pages/dashboard-page";
import CoursesPage from "@/pages/courses-page";
import TraineesPage from "@/pages/trainees-page";
import TrainersPage from "@/pages/trainers-page";
import PaymentsPage from "@/pages/payments-page";
import ReportsPage from "@/pages/reports-page";
import EmploymentReferralsPage from "@/pages/employment-referrals-page";
import AssessmentResultsPage from "@/pages/assessment-results-page";
import TrainingResultsPage from "@/pages/training-results-page";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/courses" component={CoursesPage} />
      <ProtectedRoute path="/trainees" component={TraineesPage} />
      <ProtectedRoute path="/trainers" component={TrainersPage} />
      <ProtectedRoute path="/payments" component={PaymentsPage} />
      <ProtectedRoute path="/reports" component={ReportsPage} />
      <ProtectedRoute path="/employment-referrals" component={EmploymentReferralsPage} />
      <ProtectedRoute path="/assessment-results" component={AssessmentResultsPage} />
      <ProtectedRoute path="/training-results" component={TrainingResultsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
