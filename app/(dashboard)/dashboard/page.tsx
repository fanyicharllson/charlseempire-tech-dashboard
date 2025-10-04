"use client";

import { useState } from "react";
import { Package, Users, Download, TrendingUp, Upload } from "lucide-react";
import { DashboardHeader } from "@/app/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { StatsCard } from "@/app/components/dashboard/stats-card";
import { SoftwareCard } from "@/app/components/dashboard/software-card";
import { UploadModal } from "@/app/components/dashboard/upload-modal";

export default function Dashboard() {
  // const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // const toggleTheme = () => {
  //   setTheme(theme === "dark" ? "light" : "dark");
  // };

  // Mock data for recently uploaded software
  const recentSoftware = [
    {
      id: "1",
      name: "PhotoEditor Pro",
      description:
        "Professional photo editing software with advanced features and AI-powered tools",
      version: "2.5.0",
      category: "Design",
      platform: ["Windows", "Mac"],
      price: 49.99,
      imageUrl: "/image.png",
      downloads: 1234,
      users: 856,
      uploadedAt: "2 hours ago",
    },
    {
      id: "2",
      name: "CodeMaster IDE",
      description:
        "Powerful integrated development environment for modern web development",
      version: "1.8.3",
      category: "Development",
      platform: ["Windows", "Mac", "Linux"],
      price: 0,
      imageUrl: "/image.png",
      downloads: 5678,
      users: 3421,
      uploadedAt: "5 hours ago",
    },
    {
      id: "3",
      name: "TaskFlow Manager",
      description:
        "Streamline your workflow with this intuitive task management solution",
      version: "3.2.1",
      category: "Productivity",
      platform: ["Windows", "Mac"],
      price: 29.99,
      imageUrl: "/image.png",
      downloads: 892,
      users: 645,
      uploadedAt: "1 day ago",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100`}
    >
      <div className="container mx-auto p-4">
        <DashboardHeader />

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <DashboardSidebar />
          </div>

          {/* Main content */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="space-y-6">
              {/* Stats overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Software"
                  value={156}
                  icon={Package}
                  trend="12% from last month"
                  trendUp={true}
                />
                <StatsCard
                  title="Total Users"
                  value="24.5K"
                  icon={Users}
                  trend="8% from last month"
                  trendUp={true}
                />
                <StatsCard
                  title="Total Downloads"
                  value="89.2K"
                  icon={Download}
                  trend="15% from last month"
                  trendUp={true}
                />
                <StatsCard
                  title="Revenue"
                  value="$12.4K"
                  icon={TrendingUp}
                  trend="5% from last month"
                  trendUp={false}
                />
              </div>

              {/* Upload button and recently uploaded */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-slate-100">
                    Recently Uploaded Software
                  </CardTitle>
                  <Button
                    onClick={() => setUploadModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Software
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentSoftware.map((software) => (
                    <SoftwareCard key={software.id} {...software} />
                  ))}
                </CardContent>
              </Card>

              {/* Popular software by users */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-slate-100">
                    Most Popular Software
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "VideoEdit Suite",
                        users: 12450,
                        category: "Design",
                        growth: "+24%",
                      },
                      {
                        name: "DevTools Pro",
                        users: 9823,
                        category: "Development",
                        growth: "+18%",
                      },
                      {
                        name: "Office Master",
                        users: 8765,
                        category: "Productivity",
                        growth: "+12%",
                      },
                      {
                        name: "DataSync Plus",
                        users: 7234,
                        category: "Utilities",
                        growth: "+9%",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Package className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-200">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-100">
                            {item.users.toLocaleString()}
                          </p>
                          <p className="text-xs text-green-400">
                            {item.growth}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
    </div>
  );
}
