"use client"

import { Bell, Search, Moon, Sun } from "lucide-react"
import { Avatar, Button, Tooltip } from "@radix-ui/themes"

interface DashboardHeaderProps {
  theme: "dark" | "light"
  onThemeToggle: () => void
}

export function DashboardHeader({ theme, onThemeToggle }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">CE</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-blue-500">CharlseEmpire Tech</h1>
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
          <Tooltip content="Notifications">
            <Button variant="ghost" size="1" className="relative text-slate-400 hover:text-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
            </Button>
          </Tooltip>

          <Tooltip content="Toggle theme">
            <Button
              variant="ghost"
              size="1"
              onClick={onThemeToggle}
              className="text-slate-400 hover:text-slate-100"
            >
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </Tooltip>

          <Avatar fallback="AD" className="bg-slate-700" />
        </div>
      </div>
    </header>
  )
}
