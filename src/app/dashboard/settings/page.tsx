import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardHeader } from '@/components/dashboard-header';

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader title="Settings" />
      <main className="flex-1 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage application settings. This page is a placeholder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Settings content will be added here.</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
