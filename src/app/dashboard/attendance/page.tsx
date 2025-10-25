'use client';

import * as React from 'react';
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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { students } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function AttendancePage() {
  const classes = [...new Set(students.map((s) => s.class))];
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [selectedClass, setSelectedClass] = React.useState<string | null>(null);
  const [attendance, setAttendance] = React.useState<
    Record<string, 'present' | 'absent' | 'late'>
  >({});

  const handleAttendanceChange = (studentId: string, value: 'present' | 'absent' | 'late') => {
    setAttendance((prev) => ({ ...prev, [studentId]: value }));
  };
  
  const filteredStudents = selectedClass ? students.filter(s => s.class === selectedClass) : students.slice(0,5);


  return (
    <>
      <DashboardHeader title="Attendance Tracking" />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Record Attendance</CardTitle>
            <CardDescription>
              Select a date and class to record student attendance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[280px] justify-start text-left font-normal',
                      !selectedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>
                        <RadioGroup
                          value={attendance[student.id] || student.attendance}
                          onValueChange={(value: 'present' | 'absent' | 'late') => handleAttendanceChange(student.id, value)}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="present"
                              id={`present-${student.id}`}
                            />
                            <Label htmlFor={`present-${student.id}`}>
                              Present
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="absent"
                              id={`absent-${student.id}`}
                            />
                            <Label htmlFor={`absent-${student.id}`}>
                              Absent
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="late"
                              id={`late-${student.id}`}
                            />
                            <Label htmlFor={`late-${student.id}`}>Late</Label>
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end mt-6">
              <Button>Save Attendance</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
