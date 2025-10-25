"use server";

import { analyzeStudentGrades, AnalyzeStudentGradesInput, AnalyzeStudentGradesOutput } from "@/ai/flows/analyze-student-grades";
import { z } from "zod";

const GradeAnalysisSchema = z.object({
  studentName: z.string().min(1, "Student name is required."),
  subjects: z.string().min(1, "Subjects are required."),
  grades: z.string().min(1, "Grades are required.").transform((val, ctx) => {
    const parsed = val.split(',').map(g => parseFloat(g.trim())).filter(g => !isNaN(g));
    if (parsed.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter valid, comma-separated numbers for grades.",
      });
      return z.NEVER;
    }
    return parsed;
  }),
  historicalClassPerformance: z.string().min(1, "Historical performance is required.").transform((val, ctx) => {
    const parsed = val.split(',').map(g => parseFloat(g.trim())).filter(g => !isNaN(g));
     if (parsed.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter valid, comma-separated numbers for historical performance.",
      });
      return z.NEVER;
    }
    return parsed;
  }),
});


export type AnalysisResult = { success: true; data: AnalyzeStudentGradesOutput } | { success: false; error: string };

export async function performGradeAnalysis(
  data: unknown
): Promise<AnalysisResult> {
  const validationResult = GradeAnalysisSchema.safeParse(data);

  if (!validationResult.success) {
    return { success: false, error: validationResult.error.errors.map(e => e.message).join(' ') };
  }

  try {
    const result = await analyzeStudentGrades(validationResult.data);
    return { success: true, data: result };
  } catch (error) {
    console.error("Grade analysis failed:", error);
    return { success: false, error: "An unexpected error occurred while analyzing grades." };
  }
}
