import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Check, ClipboardList, Pencil, Plus } from "lucide-react";

export type Trainee = {
  id: string;
  name: string;
  course: string;
};

// Schema for assessment
const assessmentSchema = z.object({
  traineeId: z.string({
    required_error: "Please select a trainee",
  }),
  assessmentType: z.enum(["Written", "Practical", "Project", "Final"], {
    required_error: "Please select an assessment type",
  }),
  score: z.coerce.number()
    .min(0, "Score cannot be negative")
    .max(100, "Maximum score is 100"),
  maxScore: z.coerce.number()
    .min(1, "Maximum score must be at least 1")
    .default(100),
  result: z.enum(["Pass", "Fail", "Pending"], {
    required_error: "Please select a result",
  }).default("Pending"),
  comments: z.string().optional(),
});

type AssessmentValues = z.infer<typeof assessmentSchema>;

interface AssessmentInputProps {
  trainees: Trainee[];
}

export function AssessmentInput({ trainees }: AssessmentInputProps) {
  const { toast } = useToast();
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);

  // Form setup
  const form = useForm<AssessmentValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      assessmentType: "Written",
      score: 0,
      maxScore: 100,
      result: "Pending",
      comments: "",
    },
  });

  // Watch the score and maxScore for automatic result calculation
  const score = form.watch("score");
  const maxScore = form.watch("maxScore");

  // Mutation for creating assessment
  const createAssessmentMutation = useMutation({
    mutationFn: async (values: AssessmentValues) => {
      // In a real app, this would be an API call
      console.log("Creating assessment:", values);
      
      // Simulate API call for demo purposes
      return new Promise<{ id: string }>((resolve) => {
        setTimeout(() => {
          resolve({ id: `A-${Math.floor(Math.random() * 1000)}` });
        }, 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      toast({
        title: "Assessment Added",
        description: `Assessment for ${selectedTrainee?.name} has been recorded successfully.`,
      });
      form.reset();
      setSelectedTrainee(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Add Assessment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit handler
  const onSubmit = (values: AssessmentValues) => {
    // Calculate result based on score percentage if result is pending
    if (values.result === "Pending") {
      const scorePercentage = (values.score / values.maxScore) * 100;
      values.result = scorePercentage >= 75 ? "Pass" : "Fail";
    }
    
    createAssessmentMutation.mutate(values);
  };

  // Handler for when trainee selection changes
  const handleTraineeChange = (traineeId: string) => {
    const trainee = trainees.find(t => t.id === traineeId);
    setSelectedTrainee(trainee || null);
    form.setValue("traineeId", traineeId);
  };

  // Update result automatically based on score
  const updateResultBasedOnScore = () => {
    if (score !== undefined && maxScore !== undefined) {
      const scorePercentage = (score / maxScore) * 100;
      const calculatedResult = scorePercentage >= 75 ? "Pass" : "Fail";
      form.setValue("result", calculatedResult);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" /> Record Assessment
        </CardTitle>
        <CardDescription>
          Record assessment results for trainees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="traineeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trainee</FormLabel>
                  <Select
                    onValueChange={handleTraineeChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a trainee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trainees.map((trainee) => (
                        <SelectItem key={trainee.id} value={trainee.id}>
                          {trainee.name} - {trainee.course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedTrainee && (
              <>
                <FormField
                  control={form.control}
                  name="assessmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assessment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Written">Written</SelectItem>
                          <SelectItem value="Practical">Practical</SelectItem>
                          <SelectItem value="Project">Project</SelectItem>
                          <SelectItem value="Final">Final</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Score</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={form.getValues("maxScore")}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setTimeout(updateResultBasedOnScore, 100);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Score</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setTimeout(updateResultBasedOnScore, 100);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="result"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Result</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select result" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pass">Pass</SelectItem>
                          <SelectItem value="Fail">Fail</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Result is automatically calculated based on score (Pass ≥ 75%)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter comments about the assessment"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                disabled={createAssessmentMutation.isPending || !selectedTrainee}
                className="flex items-center gap-2"
              >
                {createAssessmentMutation.isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Record Assessment
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}