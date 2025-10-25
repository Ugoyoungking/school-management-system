export type Student = {
  id: string;
  name: string;
  class: string;
  attendance: "present" | "absent" | "late";
};

export type Teacher = {
  id: string;
  name: string;
  subjects: string[];
  classes: string[];
};

export type Fee = {
  id: string;
  studentName: string;
  studentId: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Overdue";
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  sentTo: string;
};
