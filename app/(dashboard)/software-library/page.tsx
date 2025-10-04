"use client";

import { useState } from "react";
import { Search, Filter, Grid3x3, List } from "lucide-react";
import { DashboardHeader } from "@/app/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { SoftwareCard } from "@/app/components/dashboard/software-card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export default function SoftwareLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data - replace with actual data from your database
  const allSoftware = [
    {
      id: 1,
      name: "PhotoMaster Pro",
      description: "Professional photo editing suite with advanced AI features",
      version: "3.2.1",
      category: "Design",
      downloads: 15420,
      users: 8234,
      imageUrl: "/photo-editor.jpg",
      featured: true,
    },
    {
      id: 2,
      name: "CodeFlow IDE",
      description: "Modern code editor with intelligent autocomplete",
      version: "2.5.0",
      category: "Development",
      downloads: 28910,
      users: 12456,
      imageUrl: "/code-editor-interface.png",
      featured: true,
    },
    {
      id: 3,
      name: "TaskSync Manager",
      description: "Streamline your workflow with smart task management",
      version: "1.8.3",
      category: "Productivity",
      downloads: 9876,
      users: 5432,
      imageUrl: "/task-manager-interface.png",
      featured: false,
    },
    {
      id: 4,
      name: "DataViz Studio",
      description: "Create stunning data visualizations and charts",
      version: "4.1.0",
      category: "Design",
      downloads: 6543,
      users: 3210,
      imageUrl: "/data-visualization-dashboard.png",
      featured: false,
    },
    {
      id: 5,
      name: "CloudSync Pro",
      description: "Seamless cloud storage and file synchronization",
      version: "2.0.5",
      category: "Utilities",
      downloads: 18765,
      users: 9876,
      imageUrl: "/cloud-storage-interface.jpg",
      featured: true,
    },
    {
      id: 6,
      name: "AudioMix Studio",
      description: "Professional audio editing and mixing software",
      version: "5.3.2",
      category: "Design",
      downloads: 11234,
      users: 6789,
      imageUrl: "/audio-mixing-interface.jpg",
      featured: false,
    },
  ];

  const filteredSoftware = allSoftware.filter((software) => {
    const matchesSearch = software.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      software.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold text-blue-400 mb-2">
                Software Library
              </h1>
              <p className="text-slate-400">
                Browse and manage all your software
              </p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search software..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-700 text-slate-100"
                />
              </div>

              <div className="flex gap-3">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-slate-100">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-1 bg-slate-900 border border-slate-700 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-slate-800" : ""}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-slate-800" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-slate-400">
              Showing {filteredSoftware.length} of {allSoftware.length} software
            </div>

            {/* Software Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredSoftware.map((software) => (
                <SoftwareCard
                  key={software.id}
                  {...software}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {filteredSoftware.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">
                  No software found matching your criteria
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
