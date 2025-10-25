'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  CheckSquare,
  DollarSign,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ChatWidget } from '@/components/chat-widget';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/students', label: 'Students', icon: Users },
    { href: '/dashboard/teachers', label: 'Teachers', icon: GraduationCap },
    { href: '/dashboard/attendance', label: 'Attendance', icon: CheckSquare },
    { href: '/dashboard/fees', label: 'Fees', icon: DollarSign },
    { href: '/dashboard/grade-analysis', label: 'Grade Analysis', icon: Sparkles },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-sidebar-primary"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span className="font-semibold text-lg text-sidebar-primary group-data-[collapsible=icon]:hidden">
              Glide & Reign
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard/settings'}
                tooltip={{ children: 'Settings' }}
              >
                <Link href="/dashboard/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-full">{children}</div>
        <ChatWidget />
      </SidebarInset>
    </SidebarProvider>
  );
}
