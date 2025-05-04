import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Award, Check, FileCheck } from "lucide-react";

export type CompletedTrainee = {
  id: string;
  name: string;
  course: string;
  completionDate: string;
};

// Schema for training result
const trainingResultSchema = z.object({
  traineeId: z.string({
    required_error: "Please select a trainee",
  }),
  overallRating: z.coerce.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  feedback: z.string()
    .min(10, "Feedback should be at least 10 characters")
    .max(500, "Feedback cannot exceed 500 characters"),
  certificateIssued: z.boolean().default(false),
  employmentStatus: z.enum(["Employed", "Unemployed", "Referred", "Unknown"], {
    required_error: "Please select an employment status",
  }).default("Unknown"),
  employmentDetails: z.string().optional(),
});

type TrainingResultValues = z.infer<typeof trainingResultSchema>;

interface TrainingResultInputProps {
  completedTrainees: CompletedTrainee[];
}

export function TrainingResultInput({ completedTrainees }: TrainingResultInputProps) {
  const { toast } = useToast();
  const [selectedTrainee, setSelectedTrainee] = useState<CompletedTrainee | null>(null);

  // Form setup
  const form = useForm<TrainingResultValues>({
    resolver: zodResolver(trainingResultSchema),
    defaultValues: {
      overallRating: 3,
      feedback: "",
      certificateIssued: false,
      employmentStatus: "Unknown",
      employmentDetails: "",
    },
  });

  // Watch employment status for conditional fields
  const employmentStatus = form.watch("employmentStatus");
  const certificateIssued = form.watch("certificateIssued");

  // Mutation for creating training result
  const createTrainingResultMutation = useMutation({
    mutationFn: async (values: TrainingResultValues) => {
      // In a real app, this would be an API call
      console.log("Creating training result:", values);
      
      // Simulate API call for demo purposes
      return new Promise<{ id: string }>((resolve) => {
        setTimeout(() => {
          resolve({ id: `TR-${Math.floor(Math.random() * 1000)}` });
        }, 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training-results"] });
      toast({
        title: "Training Result Added",
        description: `Training result for ${selectedTrainee?.name} has been recorded successfully.`,
      });
      form.reset();
      setSelectedTrainee(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Add Training Result",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit handler
  const onSubmit = (values: TrainingResultValues) => {
    // If status is not Employed or Referred, clear employment details
    if (values.employmentStatus !== "Employed" && values.employmentStatus !== "Referred") {
      values.employmentDetails = "";
    }
    
    createTrainingResultMutation.mutate(values);
  };

  // Handler for when trainee selection changes
  const handleTraineeChange = (traineeId: string) => {
    const trainee = completedTrainees.find(t => t.id === traineeId);
    setSelectedTrainee(trainee || null);
    form.setValue("traineeId", traineeId);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" /> Record Training Result
        </CardTitle>
        <CardDescription>
          Record completion results for trainees who have finished their training
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
                  <FormLabel>Completed Trainee</FormLabel>
                  <Select
                    onValueChange={handleTraineeChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a completed trainee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {completedTrainees.map((trainee) => (
                        <SelectItem key={trainee.id} value={trainee.id}>
                          {trainee.name} - {trainee.course} (Completed: {new Date(trainee.completionDate).toLocaleDateString()})
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
                  name="overallRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overall Rating (1-5)</FormLabel>
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={5}
                            step={0.1}
                            className="w-20"
                            {...field}
                          />
                        </FormControl>
                        <span className="text-sm text-muted-foreground">out of 5.0</span>
                      </div>
                      <FormDescription>
                        Rate the trainee's overall performance
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feedback</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide detailed feedback on the trainee's performance"
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="certificateIssued"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Certificate Issued</FormLabel>
                        <FormDescription>
                          Check if the certificate has been issued to the trainee
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {certificateIssued && (
                  <div className="bg-green-50 border border-green-100 rounded-md p-3 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-green-600" />
                    <div className="text-sm">
                      Certificate number will be automatically generated upon submission
                    </div>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="employmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Employed">Employed</SelectItem>
                          <SelectItem value="Unemployed">Unemployed</SelectItem>
                          <SelectItem value="Referred">Referred</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(employmentStatus === "Employed" || employmentStatus === "Referred") && (
                  <FormField
                    control={form.control}
                    name="employmentDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {employmentStatus === "Employed" ? "Employment Details" : "Referral Details"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              employmentStatus === "Employed"
                                ? "Enter employer and position"
                                : "Enter organization referred to"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                disabled={createTrainingResultMutation.isPending || !selectedTrainee}
                className="flex items-center gap-2"
              >
                {createTrainingResultMutation.isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Record Training Result
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