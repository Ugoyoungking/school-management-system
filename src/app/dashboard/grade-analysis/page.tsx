import { DashboardHeader } from "@/components/dashboard-header";
import { AnalysisForm } from "./analysis-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function GradeAnalysisPage() {
  return (
    <>
      <DashboardHeader title="AI Grade Analysis" />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <AnalysisForm />
      </main>
    </>
  );
}
