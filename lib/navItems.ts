import {
  BarChart3,
  FolderTree,
  LayoutDashboard,
  Package,
  Settings,
  Upload,
} from "lucide-react";

// Navigation items configuration
export const navItems = [
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
