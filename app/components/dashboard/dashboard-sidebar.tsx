"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Upload,
  FolderTree,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, href, active, onClick }: NavItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(href);
    }
  };

  return (
    <Button
    variant='ghost'
      onClick={handleClick}
      className={`w-full justify-start ${
        active
          ? "bg-slate-800/70 text-blue-400"
          : "text-slate-400 hover:text-blue-100"
      }`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();

  // Navigation items configuration
  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: Package,
      label: "Software Library",
      href: "/software-library",
    },
    {
      icon: Upload,
      label: "Upload Software",
      href: "/upload",
    },
    {
      icon: FolderTree,
      label: "Categories",
      href: "/categories",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/analytics",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 md:min-h-screen h-full">
      <CardContent className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
            />
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
