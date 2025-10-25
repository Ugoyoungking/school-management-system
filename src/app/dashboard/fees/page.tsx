'use client';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Receipt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fees } from '@/lib/data';
import { DashboardHeader } from '@/components/dashboard-header';

export default function FeesPage() {
  return (
    <>
      <DashboardHeader title="Fee Management" />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Fee Payments</CardTitle>
              <CardDescription>Track payments and manage fees.</CardDescription>
            </div>
            <Button size="sm" onClick={() => alert('Record payment form should appear here.')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>
                      <div className="font-medium">{fee.studentName}</div>
                      <div className="text-sm text-muted-foreground">{fee.studentId}</div>
                    </TableCell>
                    <TableCell>${fee.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={fee.status === 'Paid' ? 'default' : fee.status === 'Pending' ? 'secondary' : 'destructive'}
                       className={fee.status === 'Paid' ? 'bg-green-500/20 text-green-700 border-transparent hover:bg-green-500/30' : 
                                    fee.status === 'Pending' ? 'bg-amber-500/20 text-amber-700 border-transparent hover:bg-amber-500/30' : 
                                    'bg-red-500/20 text-red-700 border-transparent hover:bg-red-500/30'}>
                        {fee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{fee.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Receipt className="mr-2 h-4 w-4" />
                            Generate Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
