"use client";

import { Bell, Search, Moon, Sun, LogOut, User, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUser, useClerk } from "@clerk/nextjs";

interface DashboardHeaderProps {
  theme?: "dark" | "light";
  onThemeToggle?: () => void;
}

export function DashboardHeader({
  theme,
  onThemeToggle,
}: DashboardHeaderProps) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  // Get user's initials for fallback
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user?.firstName) {
      return user.firstName.slice(0, 2).toUpperCase();
    } else if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.slice(0, 2).toUpperCase();
    }
    return "AD"; // Default fallback
  };
  return (
    <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">CE</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-blue-500">
            CharlseEmpire Tech
          </h1>
          <p className="text-xs text-slate-400">Software Management</p>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search software..."
            className="bg-transparent border-none focus:outline-none text-sm w-48 placeholder:text-slate-500 text-slate-100"
          />
        </div>

        <div className="flex items-center space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-slate-400 hover:text-slate-100"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onThemeToggle}
                  className="text-slate-400 hover:text-slate-100"
                >
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarImage
                    src={
                      user?.imageUrl || "/placeholder.svg?height=40&width=40"
                    }
                    alt={user?.fullName || "User"}
                  />
                  <AvatarFallback className="bg-slate-700 text-blue-500">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-slate-900"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground text-truncate text-slate-400">
                    {user?.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openUserProfile()}
                className="hover:bg-slate-700/50 focus:bg-slate-700/50 cursor-pointer" 
              >
                <User className="mr-2 h-4 w-4 text-white" />
                <span className="text-white">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-700/50 focus:bg-slate-700/50 cursor-pointer">
                <Settings className="mr-2 h-4 w-4 text-white" />
                <span className="text-white">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="hover:bg-red-600/10 focus:bg-red-600/10 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                <span className="text-red-500">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
