'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing student grades,
 * predicting performance, and identifying students who may need additional support.
 *
 * - analyzeStudentGrades - A function that orchestrates the grade analysis process.
 * - AnalyzeStudentGradesInput - The input type for the analyzeStudentGrades function.
 * - AnalyzeStudentGradesOutput - The return type for the analyzeStudentGrades function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStudentGradesInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  grades: z.array(z.number()).describe('An array of the student\'s grades.'),
  historicalClassPerformance: z.array(z.number()).describe('Historical performance data for the class.'),
  subjects: z.string().describe('Subjects that student is taking'),
});
export type AnalyzeStudentGradesInput = z.infer<typeof AnalyzeStudentGradesInputSchema>;

const AnalyzeStudentGradesOutputSchema = z.object({
  predictedPerformance: z.string().describe('The predicted performance of the student.'),
  areasForImprovement: z.string().describe('Specific areas where the student can improve.'),
  needAdditionalSupport: z.boolean().describe('Whether the student needs additional support.'),
  suggestedInterventions: z.string().describe('Suggested interventions for the student.'),
});
export type AnalyzeStudentGradesOutput = z.infer<typeof AnalyzeStudentGradesOutputSchema>;

export async function analyzeStudentGrades(input: AnalyzeStudentGradesInput): Promise<AnalyzeStudentGradesOutput> {
  return analyzeStudentGradesFlow(input);
}

const analyzeStudentGradesPrompt = ai.definePrompt({
  name: 'analyzeStudentGradesPrompt',
  input: {schema: AnalyzeStudentGradesInputSchema},
  output: {schema: AnalyzeStudentGradesOutputSchema},
  prompt: `You are an AI-powered educational tool designed to analyze student grades and predict future performance.

  Analyze the student's grades, historical class performance, and subjects to provide insights into the student's potential and areas for improvement. The historical data consists of data about class performance, make sure to compare student performance against it.

  Student Name: {{{studentName}}}
  Grades: {{{grades}}}
  Historical Class Performance: {{{historicalClassPerformance}}}
  Subjects: {{{subjects}}}

  Based on this information, determine the predicted performance of the student, identify areas where they can improve, and suggest interventions to help them succeed.
  Also, determine if student needs additional support.
  `,
});

const analyzeStudentGradesFlow = ai.defineFlow(
  {
    name: 'analyzeStudentGradesFlow',
    inputSchema: AnalyzeStudentGradesInputSchema,
    outputSchema: AnalyzeStudentGradesOutputSchema,
  },
  async input => {
    const {output} = await analyzeStudentGradesPrompt(input);
    return output!;
  }
);
