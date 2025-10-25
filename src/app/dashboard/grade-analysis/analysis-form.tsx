"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { performGradeAnalysis, AnalysisResult } from "./actions";
import { AnalyzeStudentGradesOutput } from "@/ai/flows/analyze-student-grades";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BrainCircuit, Check, Lightbulb, Loader2, Target } from "lucide-react";

const formSchema = z.object({
  studentName: z.string().min(2, {
    message: "Student name must be at least 2 characters.",
  }),
  subjects: z.string().min(2, {
    message: "Subjects must be at least 2 characters.",
  }),
  grades: z.string().refine((val) => val.split(',').every(g => !isNaN(parseFloat(g))), {
    message: "Grades must be comma-separated numbers.",
  }),
  historicalClassPerformance: z.string().refine((val) => val.split(',').every(g => !isNaN(parseFloat(g))), {
    message: "Historical performance must be comma-separated numbers.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function AnalysisForm() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeStudentGradesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      subjects: "",
      grades: "",
      historicalClassPerformance: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    const result = await performGradeAnalysis(values);
    if (result.success) {
      setAnalysisResult(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Grade Analysis Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subjects</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Math, Science, History" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grades"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student's Grades</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 85, 92, 78, 88" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter grades separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalClassPerformance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Class Performance</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 75, 80, 82, 79" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter average class grades for the same subjects.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Grades
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {isLoading && (
            <div className="flex items-center justify-center rounded-lg border h-full p-8">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">AI is analyzing the data...</p>
                </div>
            </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {analysisResult && (
            <Card className="bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BrainCircuit className="text-primary"/>
                        AI Analysis Results
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold flex items-center gap-2"><Target/> Predicted Performance</h3>
                        <p className="text-muted-foreground mt-1">{analysisResult.predictedPerformance}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold flex items-center gap-2"><Lightbulb/> Areas for Improvement</h3>
                        <p className="text-muted-foreground mt-1">{analysisResult.areasForImprovement}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold flex items-center gap-2"><Check/> Suggested Interventions</h3>
                        <p className="text-muted-foreground mt-1">{analysisResult.suggestedInterventions}</p>
                    </div>
                     {analysisResult.needAdditionalSupport && (
                        <Alert variant="default" className="bg-amber-500/10 border-amber-500/50">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <AlertTitle className="text-amber-700">Additional Support Recommended</AlertTitle>
                            <AlertDescription className="text-amber-600">
                                This student may benefit from additional support and personalized attention.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
