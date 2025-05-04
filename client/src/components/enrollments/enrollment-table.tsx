import { useState } from "react";
import { Eye, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface Enrollment {
  id: string;
  traineeName: string;
  traineeInitials: string;
  courseName: string;
  trainerName: string;
  status: "Active" | "Completed" | "Dropped";
  payment: "Paid" | "Partial" | "Unpaid";
}

interface EnrollmentTableProps {
  enrollments: Enrollment[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

export function EnrollmentTable({ enrollments, onView, onEdit }: EnrollmentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination values
  const totalPages = Math.ceil(enrollments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, enrollments.length);
  const currentEnrollments = enrollments.slice(startIndex, endIndex);

  // Get status badge variant
  const getStatusBadge = (status: Enrollment["status"]) => {
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
  const getPaymentBadge = (payment: Enrollment["payment"]) => {
    switch (payment) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{payment}</Badge>;
      case "Partial":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{payment}</Badge>;
      case "Unpaid":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{payment}</Badge>;
      default:
        return <Badge>{payment}</Badge>;
    }
  };

  // Generate avatar color based on trainee initials
  const getAvatarColor = (initials: string) => {
    const colors = ["bg-primary", "bg-secondary", "bg-accent", "bg-info", "bg-warning"];
    const hash = initials.charCodeAt(0) % colors.length;
    return colors[hash];
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Enrollments</h3>
        <Button variant="link" className="text-primary">
          View All
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Trainee Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEnrollments.map((enrollment) => (
              <TableRow key={enrollment.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{enrollment.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className={`h-8 w-8 ${getAvatarColor(enrollment.traineeInitials)} text-white mr-3`}>
                      <AvatarFallback>{enrollment.traineeInitials}</AvatarFallback>
                    </Avatar>
                    <span>{enrollment.traineeName}</span>
                  </div>
                </TableCell>
                <TableCell>{enrollment.courseName}</TableCell>
                <TableCell>{enrollment.trainerName}</TableCell>
                <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                <TableCell>{getPaymentBadge(enrollment.payment)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(enrollment.id)}
                    className="text-primary hover:text-primary-dark"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(enrollment.id)}
                    className="text-secondary hover:text-secondary-dark ml-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{enrollments.length}</span> results
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
