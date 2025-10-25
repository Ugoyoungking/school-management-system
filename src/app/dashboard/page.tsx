import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { students, teachers, fees } from '@/lib/data';
import {
  Users,
  GraduationCap,
  CheckCircle,
  DollarSign,
  Activity,
  ArrowUp,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard-header';

export default function Dashboard() {
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const attendancePresent = students.filter(s => s.attendance === 'present').length;
  const attendancePercentage = Math.round((attendancePresent / totalStudents) * 100);
  const totalRevenue = fees.filter(f => f.status === 'Paid').reduce((acc, fee) => acc + fee.amount, 0);

  return (
    <>
      <DashboardHeader title="Dashboard" />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTeachers}</div>
              <p className="text-xs text-muted-foreground">+1 from last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendancePercentage}%</div>
              <p className="text-xs text-muted-foreground">{attendancePresent} of {totalStudents} students present</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue (Term)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+10% from last term</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>A list of recent fee payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.slice(0, 5).map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell>
                        <div className="font-medium">{fee.studentName}</div>
                        <div className="text-sm text-muted-foreground">{fee.studentId}</div>
                      </TableCell>
                      <TableCell>${fee.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={fee.status === 'Paid' ? 'default' : fee.status === 'Pending' ? 'secondary' : 'destructive'}
                         className={fee.status === 'Paid' ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30' : 
                                      fee.status === 'Pending' ? 'bg-amber-500/20 text-amber-700 hover:bg-amber-500/30' : 
                                      'bg-red-500/20 text-red-700 hover:bg-red-500/30'}>
                          {fee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{fee.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
