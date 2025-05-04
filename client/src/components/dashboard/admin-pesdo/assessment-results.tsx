import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

export interface AssessmentResult {
  id: string;
  traineeName: string;
  course: string;
  assessmentDate: string;
  score: number;
  status: "Passed" | "Failed" | "Incomplete";
  hasAttachment: boolean;
}

interface AssessmentResultsProps {
  results: AssessmentResult[];
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

export function AssessmentResults({ results, onView, onDownload }: AssessmentResultsProps) {
  // Get status badge with appropriate styling
  const getStatusBadge = (status: AssessmentResult["status"]) => {
    switch (status) {
      case "Passed":
        return <Badge className="bg-green-500 hover:bg-green-600">Passed</Badge>;
      case "Failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "Incomplete":
        return <Badge variant="outline">Incomplete</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Assessment Results</CardTitle>
        <CardDescription>
          Recent trainee assessment outcomes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No assessment results available
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainee</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">
                    {result.traineeName}
                  </TableCell>
                  <TableCell>{result.course}</TableCell>
                  <TableCell>{formatDate(result.assessmentDate)}</TableCell>
                  <TableCell>{result.score}%</TableCell>
                  <TableCell>{getStatusBadge(result.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onView(result.id)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      {result.hasAttachment && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => onDownload(result.id)}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}