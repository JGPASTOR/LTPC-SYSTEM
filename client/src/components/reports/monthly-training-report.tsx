import React, { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Interface for the report data
interface TrainingReportData {
  month: string;
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

// Sample monthly data
const monthlyReports: Record<string, TrainingReportData> = {
  "January": {
    month: "January",
    year: 2024,
    courses: [
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
      },
      {
        qualification: "BARTENDING NC II",
        type: "Regular",
        trainingPeriod: "Jan 10, 2024 - Feb 9, 2024",
        enrolled: {
          total: 20,
          male: 12,
          female: 8,
          ageDistribution: {
            below18: 0,
            age18To25: 14,
            age26To35: 5,
            age36To45: 1,
            above45: 0
          },
          finished: 18,
          finishedPercentage: 90
        },
        employment: {
          employed: 16,
          selfEmployed: 0,
          unemployed: 2,
          percentage: 89
        }
      }
    ]
  },
  "February": {
    month: "February",
    year: 2024,
    courses: [
      {
        qualification: "COMPUTER SERVICING NC II",
        type: "Regular",
        trainingPeriod: "Feb 5, 2024 - Mar 8, 2024",
        enrolled: {
          total: 30,
          male: 23,
          female: 7,
          ageDistribution: {
            below18: 3,
            age18To25: 18,
            age26To35: 7,
            age36To45: 2,
            above45: 0
          },
          finished: 28,
          finishedPercentage: 93
        },
        employment: {
          employed: 24,
          selfEmployed: 2,
          unemployed: 2,
          percentage: 93
        }
      }
    ]
  },
  "March": {
    month: "March",
    year: 2024,
    courses: [
      {
        qualification: "DRIVING NC II",
        type: "WET",
        trainingPeriod: "Mar 1, 2024 - Mar 25, 2024",
        enrolled: {
          total: 15,
          male: 12,
          female: 3,
          ageDistribution: {
            below18: 0,
            age18To25: 6,
            age26To35: 7,
            age36To45: 2,
            above45: 0
          },
          finished: 15,
          finishedPercentage: 100
        },
        employment: {
          employed: 13,
          selfEmployed: 1,
          unemployed: 1,
          percentage: 93
        }
      }
    ]
  },
  "April": {
    month: "April",
    year: 2024,
    courses: [
      {
        qualification: "BREAD & PASTRY NC II",
        type: "Regular",
        trainingPeriod: "Apr 1, 2024 - May 5, 2024",
        enrolled: {
          total: 25,
          male: 5,
          female: 20,
          ageDistribution: {
            below18: 1,
            age18To25: 12,
            age26To35: 8,
            age36To45: 4,
            above45: 0
          },
          finished: 24,
          finishedPercentage: 96
        },
        employment: {
          employed: 18,
          selfEmployed: 4,
          unemployed: 2,
          percentage: 92
        }
      }
    ]
  },
  "May": {
    month: "May",
    year: 2024,
    courses: [
      {
        qualification: "CARPENTRY NC II",
        type: "Regular",
        trainingPeriod: "May 15, 2024 - Jun 20, 2024",
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
      }
    ]
  },
  "June": {
    month: "June",
    year: 2024,
    courses: [
      {
        qualification: "COOKERY NC II",
        type: "Regular",
        trainingPeriod: "June 15, 2024 - July 20, 2024",
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
      }
    ]
  },
  "July": {
    month: "July",
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
      }
    ]
  }
};

const MonthlyTrainingReport: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("January");
  const reportData = monthlyReports[selectedMonth];

  // Calculate totals for the selected month
  const getTotals = () => {
    if (!reportData) return {
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
    };

    return reportData.courses.reduce(
      (acc: any, course: any) => {
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
  const totalOverallPercentage = totals.totalFinished === 0 ? 0 : 
    Math.round((totals.totalEmployed / totals.totalFinished) * 100);

  const availableMonths = Object.keys(monthlyReports);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center">
          <div>
            <CardTitle className="text-lg sm:text-xl">
              LTPC Monthly Training and Employment Report
            </CardTitle>
            <CardDescription>
              Summary of training programs and employment outcomes for {reportData?.month} {reportData?.year}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Label htmlFor="month-select">Select Month:</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger id="month-select" className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
            {reportData?.courses.map((course: any, index: number) => (
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
            {reportData?.courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={18} className="border text-center py-4">No courses for this month</TableCell>
              </TableRow>
            ) : (
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
                  <Badge 
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    {totals.totalFinished === 0 ? 0 : Math.round((totals.totalFinished / totals.totalEnrolled) * 100)}%
                  </Badge>
                </TableCell>
                <TableCell className="border text-center">{totals.totalEmployed}</TableCell>
                <TableCell className="border text-center">{totals.totalSelfEmployed}</TableCell>
                <TableCell className="border text-center">{totals.totalUnemployed}</TableCell>
                <TableCell className="border text-center">
                  <Badge 
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    {totalOverallPercentage}%
                  </Badge>
                </TableCell>
                <TableCell className="border text-center">{totals.totalEnrolled}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {reportData?.courses.length > 0 && (
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
                  <span className="font-bold">
                    {totals.totalFinished === 0 ? 0 : Math.round((totals.totalFinished / totals.totalEnrolled) * 100)}%
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Employment Rate:</span>
                  <span className="font-bold">{totalOverallPercentage}%</span>
                </li>
                <li className="flex justify-between">
                  <span>Gender Distribution:</span>
                  <span className="font-bold">
                    Male: {totals.totalEnrolled === 0 ? 0 : Math.round((totals.totalMale / totals.totalEnrolled) * 100)}% | 
                    Female: {totals.totalEnrolled === 0 ? 0 : Math.round((totals.totalFemale / totals.totalEnrolled) * 100)}%
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-md">
              <h3 className="font-medium text-lg mb-2">Age Demographics</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Below 18:</span>
                  <span className="font-bold">
                    {totals.totalEnrolled === 0 ? 0 : Math.round((totals.totalBelow18 / totals.totalEnrolled) * 100)}%
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>18-25:</span>
                  <span className="font-bold">
                    {totals.totalEnrolled === 0 ? 0 : Math.round((totals.totalAge18To25 / totals.totalEnrolled) * 100)}%
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>26-35:</span>
                  <span className="font-bold">
                    {totals.totalEnrolled === 0 ? 0 : Math.round((totals.totalAge26To35 / totals.totalEnrolled) * 100)}%
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>36-45:</span>
                  <span className="font-bold">
                    {totals.totalEnrolled === 0 ? 0 : Math.round((totals.totalAge36To45 / totals.totalEnrolled) * 100)}%
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Above 45:</span>
                  <span className="font-bold">
                    {totals.totalEnrolled === 0 ? 0 : Math.round((totals.totalAbove45 / totals.totalEnrolled) * 100)}%
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyTrainingReport;