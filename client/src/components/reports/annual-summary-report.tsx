import React from "react";
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

// Interface for the annual report data
interface AnnualReportData {
  year: number;
  courses: {
    qualification: string;
    type: string;
    trainingPeriod: string;
    enrolled: {
      total: number;
      male: number;
      female: number;
      ageDistribution: {
        below18: number;
        age18To25: number;
        age26To35: number;
        age36To45: number;
        above45: number;
      };
      finished: number;
      finishedPercentage: number;
    };
    employment: {
      employed: number;
      selfEmployed: number;
      unemployed: number;
      percentage: number;
    };
  }[];
}

// Sample data based on the attached image
const sampleAnnualReport: AnnualReportData = {
  year: 2024,
  courses: [
    {
      qualification: "CARPENTRY NC II",
      type: "Regular",
      trainingPeriod: "July 17, 2023 - August 15, 2023",
      enrolled: {
        total: 25,
        male: 25,
        female: 0,
        ageDistribution: {
          below18: 1,
          age18To25: 8,
          age26To35: 9,
          age36To45: 7,
          above45: 0
        },
        finished: 25,
        finishedPercentage: 100
      },
      employment: {
        employed: 22,
        selfEmployed: 0,
        unemployed: 3,
        percentage: 88
      }
    },
    {
      qualification: "COOKERY NC II",
      type: "Regular",
      trainingPeriod: "August 14, 2023 - Oct 13, 2023",
      enrolled: {
        total: 25,
        male: 5,
        female: 20,
        ageDistribution: {
          below18: 2,
          age18To25: 13,
          age26To35: 7,
          age36To45: 3,
          above45: 0
        },
        finished: 25,
        finishedPercentage: 100
      },
      employment: {
        employed: 25,
        selfEmployed: 0,
        unemployed: 0,
        percentage: 100
      }
    },
    {
      qualification: "DRESSMAKING NC II",
      type: "Regular",
      trainingPeriod: "November 18, 2023 - Jan 19, 2024",
      enrolled: {
        total: 25,
        male: 0,
        female: 25,
        ageDistribution: {
          below18: 2,
          age18To25: 8,
          age26To35: 12,
          age36To45: 3,
          above45: 0
        },
        finished: 25,
        finishedPercentage: 100
      },
      employment: {
        employed: 23,
        selfEmployed: 0,
        unemployed: 2,
        percentage: 92
      }
    }
  ]
};

const AnnualSummaryReport: React.FC = () => {
  // Calculate totals
  const getTotals = () => {
    return sampleAnnualReport.courses.reduce(
      (acc, course) => {
        acc.totalEnrolled += course.enrolled.total;
        acc.totalMale += course.enrolled.male;
        acc.totalFemale += course.enrolled.female;
        acc.totalBelow18 += course.enrolled.ageDistribution.below18;
        acc.totalAge18To25 += course.enrolled.ageDistribution.age18To25;
        acc.totalAge26To35 += course.enrolled.ageDistribution.age26To35;
        acc.totalAge36To45 += course.enrolled.ageDistribution.age36To45;
        acc.totalAbove45 += course.enrolled.ageDistribution.above45;
        acc.totalFinished += course.enrolled.finished;
        acc.totalEmployed += course.employment.employed;
        acc.totalSelfEmployed += course.employment.selfEmployed;
        acc.totalUnemployed += course.employment.unemployed;
        return acc;
      },
      {
        totalEnrolled: 0,
        totalMale: 0,
        totalFemale: 0,
        totalBelow18: 0,
        totalAge18To25: 0,
        totalAge26To35: 0,
        totalAge36To45: 0,
        totalAbove45: 0,
        totalFinished: 0,
        totalEmployed: 0,
        totalSelfEmployed: 0,
        totalUnemployed: 0
      }
    );
  };

  const totals = getTotals();
  const totalOverallPercentage = Math.round(
    (totals.totalEmployed / totals.totalFinished) * 100
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          LTPC Annual Training and Employment Report {sampleAnnualReport.year}
        </CardTitle>
        <CardDescription>
          Summary of training programs and employment outcomes for the year
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead rowSpan={3} className="border">Qualification</TableHead>
              <TableHead rowSpan={3} className="border">Type of Training</TableHead>
              <TableHead rowSpan={3} className="border">Training Period</TableHead>
              <TableHead colSpan={9} className="border text-center">Enrollment</TableHead>
              <TableHead colSpan={4} className="border text-center">Employment Status</TableHead>
              <TableHead rowSpan={3} className="border">TOTAL ATTENDEES</TableHead>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableHead rowSpan={2} className="border">Total</TableHead>
              <TableHead colSpan={2} className="border text-center">Gender</TableHead>
              <TableHead colSpan={5} className="border text-center">Age Distribution</TableHead>
              <TableHead rowSpan={2} className="border">% Finished</TableHead>
              <TableHead rowSpan={2} className="border">Employed</TableHead>
              <TableHead rowSpan={2} className="border">Self-Employed</TableHead>
              <TableHead rowSpan={2} className="border">Unemployed</TableHead>
              <TableHead rowSpan={2} className="border">Employment Rate</TableHead>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableHead className="border">Male</TableHead>
              <TableHead className="border">Female</TableHead>
              <TableHead className="border">Below 18</TableHead>
              <TableHead className="border">18-25</TableHead>
              <TableHead className="border">26-35</TableHead>
              <TableHead className="border">36-45</TableHead>
              <TableHead className="border">Above 45</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleAnnualReport.courses.map((course, index) => (
              <TableRow key={index}>
                <TableCell className="border font-medium">{course.qualification}</TableCell>
                <TableCell className="border">{course.type}</TableCell>
                <TableCell className="border">{course.trainingPeriod}</TableCell>
                <TableCell className="border text-center">{course.enrolled.total}</TableCell>
                <TableCell className="border text-center">{course.enrolled.male}</TableCell>
                <TableCell className="border text-center">{course.enrolled.female}</TableCell>
                <TableCell className="border text-center">{course.enrolled.ageDistribution.below18}</TableCell>
                <TableCell className="border text-center">{course.enrolled.ageDistribution.age18To25}</TableCell>
                <TableCell className="border text-center">{course.enrolled.ageDistribution.age26To35}</TableCell>
                <TableCell className="border text-center">{course.enrolled.ageDistribution.age36To45}</TableCell>
                <TableCell className="border text-center">{course.enrolled.ageDistribution.above45}</TableCell>
                <TableCell className="border text-center">
                  <Badge 
                    variant="secondary"
                    className={course.enrolled.finishedPercentage === 100 ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}
                  >
                    {course.enrolled.finishedPercentage}%
                  </Badge>
                </TableCell>
                <TableCell className="border text-center">{course.employment.employed}</TableCell>
                <TableCell className="border text-center">{course.employment.selfEmployed}</TableCell>
                <TableCell className="border text-center">{course.employment.unemployed}</TableCell>
                <TableCell className="border text-center">
                  <Badge 
                    variant={course.employment.percentage >= 70 ? "secondary" : "outline"}
                    className={course.employment.percentage >= 90 ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}
                  >
                    {course.employment.percentage}%
                  </Badge>
                </TableCell>
                <TableCell className="border text-center">{course.enrolled.total}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold bg-muted/50">
              <TableCell colSpan={3} className="border text-center">TOTAL / AVERAGE</TableCell>
              <TableCell className="border text-center">{totals.totalEnrolled}</TableCell>
              <TableCell className="border text-center">{totals.totalMale}</TableCell>
              <TableCell className="border text-center">{totals.totalFemale}</TableCell>
              <TableCell className="border text-center">{totals.totalBelow18}</TableCell>
              <TableCell className="border text-center">{totals.totalAge18To25}</TableCell>
              <TableCell className="border text-center">{totals.totalAge26To35}</TableCell>
              <TableCell className="border text-center">{totals.totalAge36To45}</TableCell>
              <TableCell className="border text-center">{totals.totalAbove45}</TableCell>
              <TableCell className="border text-center">
                <Badge variant="success">100%</Badge>
              </TableCell>
              <TableCell className="border text-center">{totals.totalEmployed}</TableCell>
              <TableCell className="border text-center">{totals.totalSelfEmployed}</TableCell>
              <TableCell className="border text-center">{totals.totalUnemployed}</TableCell>
              <TableCell className="border text-center">
                <Badge variant="success">{totalOverallPercentage}%</Badge>
              </TableCell>
              <TableCell className="border text-center">{totals.totalEnrolled}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/30 p-4 rounded-md">
            <h3 className="font-medium text-lg mb-2">Summary Statistics</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Total Trainees:</span>
                <span className="font-bold">{totals.totalEnrolled}</span>
              </li>
              <li className="flex justify-between">
                <span>Completion Rate:</span>
                <span className="font-bold">100%</span>
              </li>
              <li className="flex justify-between">
                <span>Employment Rate:</span>
                <span className="font-bold">{totalOverallPercentage}%</span>
              </li>
              <li className="flex justify-between">
                <span>Gender Distribution:</span>
                <span className="font-bold">
                  Male: {Math.round((totals.totalMale / totals.totalEnrolled) * 100)}% | 
                  Female: {Math.round((totals.totalFemale / totals.totalEnrolled) * 100)}%
                </span>
              </li>
            </ul>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-md">
            <h3 className="font-medium text-lg mb-2">Age Demographics</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Below 18:</span>
                <span className="font-bold">{Math.round((totals.totalBelow18 / totals.totalEnrolled) * 100)}%</span>
              </li>
              <li className="flex justify-between">
                <span>18-25:</span>
                <span className="font-bold">{Math.round((totals.totalAge18To25 / totals.totalEnrolled) * 100)}%</span>
              </li>
              <li className="flex justify-between">
                <span>26-35:</span>
                <span className="font-bold">{Math.round((totals.totalAge26To35 / totals.totalEnrolled) * 100)}%</span>
              </li>
              <li className="flex justify-between">
                <span>36-45:</span>
                <span className="font-bold">{Math.round((totals.totalAge36To45 / totals.totalEnrolled) * 100)}%</span>
              </li>
              <li className="flex justify-between">
                <span>Above 45:</span>
                <span className="font-bold">{Math.round((totals.totalAbove45 / totals.totalEnrolled) * 100)}%</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnualSummaryReport;