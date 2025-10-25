import type { Student, Teacher, Fee, Notification } from './types';

export const students: Student[] = [
  { id: 'GRS-001', name: 'Alice Johnson', class: '10A', attendance: 'present' },
  { id: 'GRS-002', name: 'Bob Williams', class: '10A', attendance: 'present' },
  { id: 'GRS-003', name: 'Charlie Brown', class: '10B', attendance: 'absent' },
  { id: 'GRS-004', name: 'Diana Miller', class: '11A', attendance: 'present' },
  { id: 'GRS-005', name: 'Ethan Davis', class: '11A', attendance: 'late' },
  { id: 'GRS-006', name: 'Fiona Wilson', class: '12B', attendance: 'present' },
  { id: 'GRS-007', name: 'George Taylor', class: '12B', attendance: 'present' },
  { id: 'GRS-008', name: 'Hannah Moore', class: '10A', attendance: 'absent' },
  { id: 'GRS-009', name: 'Ian Clark', class: '11B', attendance: 'present' },
  { id: 'GRS-010', name: 'Jane Lewis', class: '12A', attendance: 'present' },
];

export const teachers: Teacher[] = [
  { id: 'GRT-01', name: 'Mr. David Smith', subjects: ['Mathematics'], classes: ['10A', '10B'] },
  { id: 'GRT-02', name: 'Ms. Sarah Jones', subjects: ['English', 'History'], classes: ['11A', '11B'] },
  { id: 'GRT-03', name: 'Dr. Peter Chen', subjects: ['Physics', 'Chemistry'], classes: ['12A', '12B'] },
  { id: 'GRT-04', name: 'Mrs. Emily White', subjects: ['Biology'], classes: ['10A', '11A'] },
];

export const fees: Fee[] = [
  { id: 'FEE-001', studentName: 'Alice Johnson', studentId: 'GRS-001', amount: 500, date: '2024-05-01', status: 'Paid' },
  { id: 'FEE-002', studentName: 'Bob Williams', studentId: 'GRS-002', amount: 500, date: '2024-05-02', status: 'Paid' },
  { id: 'FEE-003', studentName: 'Charlie Brown', studentId: 'GRS-003', amount: 500, date: '2024-05-03', status: 'Pending' },
  { id: 'FEE-004', studentName: 'Diana Miller', studentId: 'GRS-004', amount: 600, date: '2024-05-01', status: 'Paid' },
  { id: 'FEE-005', studentName: 'Ethan Davis', studentId: 'GRS-005', amount: 600, date: '2024-05-04', status: 'Overdue' },
];

export const notifications: Notification[] = [
    {
      id: 'NOTIF-001',
      title: 'Parent-Teacher Meeting Announcement',
      message: 'The quarterly parent-teacher meetings will be held next week from Monday to Wednesday. Please book your slots.',
      date: '2024-05-15',
      sentTo: 'All Parents',
    },
    {
      id: 'NOTIF-002',
      title: 'School Sports Day',
      message: 'The annual sports day is scheduled for this Friday. All students are requested to come in their house colors.',
      date: '2024-05-12',
      sentTo: 'All Students',
    },
     {
      id: 'NOTIF-003',
      title: 'Science Fair Submissions',
      message: 'The deadline for science fair project submissions is tomorrow. Please submit your projects to Dr. Chen.',
      date: '2024-05-10',
      sentTo: 'Grade 11 & 12 Students',
    },
];
