'use client';

import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { MainNav } from '@/components/main-nav';
import { Logo } from '@/components/icons';
import { AppProvider } from '@/context/app-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar collapsible="icon">
            <SidebarHeader>
              <Link href="/" className="flex items-center gap-2">
                <Logo className="w-6 h-6 text-primary" />
                <span className="font-bold text-lg">LinkFlow AI</span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <MainNav />
            </SidebarContent>
            <SidebarFooter>{/* Footer content if any */}</SidebarFooter>
          </Sidebar>
          <div className="flex-1 flex flex-col">
            <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </AppProvider>
  );
}
