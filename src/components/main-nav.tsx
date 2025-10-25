"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  User,
  FileText,
  History,
  Plug,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/drafts", label: "Drafts", icon: FileText },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/connect", label: "Connections", icon: Plug },
  { href: "/logs", label: "Logs", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={{ children: item.label, side: "right", align: "center" }}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
