/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Package,
  Users,
  Download,
  TrendingUp,
  Upload,
  Loader2,
} from "lucide-react";
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
import { DeleteModal } from "@/app/components/dashboard/delete-modal";
import { useSoftware, useDeleteSoftware } from "@/hooks/use-software";
import { formatNumber } from "@/lib/utils";
import { useToast } from "@/app/components/ui/use-toast";
import type { Software } from "@/types/software";

export default function Dashboard() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [softwareToDelete, setSoftwareToDelete] = useState<Software | null>(
    null
  );
  const { toast } = useToast();

  // Fetch software data
  const { data: software, isLoading, isError, error } = useSoftware();
  const deleteSoftware = useDeleteSoftware();

  // Calculate stats
  const totalSoftware = software?.length || 0;
  const totalRevenue = software?.reduce((sum, s) => sum + s.price, 0) || 0;
  const recentSoftware = software?.slice(0, 3) || [];

  const handleDeleteClick = (id: string) => {
    const item = software?.find((s) => s.id === id);
    if (item) {
      setSoftwareToDelete(item);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!softwareToDelete) return;

    try {
      await deleteSoftware.mutateAsync(softwareToDelete.id);
      toast({
        title: "Deleted! 🗑️",
        description: `${softwareToDelete.name} has been removed successfully`,
        className: "bg-green-500 text-white",
      });
      setDeleteModalOpen(false);
      setSoftwareToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete software",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100">
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
                  value={totalSoftware}
                  icon={Package}
                  trend={`${totalSoftware} items`}
                  trendUp={true}
                />
                <StatsCard
                  title="Total Users"
                  value="N/A"
                  icon={Users}
                  trend="Coming soon"
                  trendUp={true}
                />
                <StatsCard
                  title="Total Downloads"
                  value="N/A"
                  icon={Download}
                  trend="Coming soon"
                  trendUp={true}
                />
                <StatsCard
                  title="Revenue"
                  value={`$${formatNumber(totalRevenue)}`}
                  icon={TrendingUp}
                  trend={`${totalSoftware} products`}
                  trendUp={true}
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
                  {/* Loading state */}
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      <span className="ml-2 text-slate-400">
                        Loading software...
                      </span>
                    </div>
                  )}

                  {/* Error state */}
                  {isError && (
                    <div className="text-center py-8">
                      <p className="text-red-400">Failed to load software</p>
                      <p className="text-sm text-slate-500 mt-2">
                        {error?.message || "Please try again"}
                      </p>
                    </div>
                  )}

                  {/* Empty state */}
                  {!isLoading && !isError && totalSoftware === 0 && (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-300 mb-2">
                        No software yet
                      </h3>
                      <p className="text-slate-500 mb-4">
                        Upload your first software to get started
                      </p>
                      <Button
                        onClick={() => setUploadModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Software
                      </Button>
                    </div>
                  )}

                  {/* Software list */}
                  {!isLoading && !isError && recentSoftware.length > 0 && (
                    <>
                      {recentSoftware.map((item) => (
                        <SoftwareCard
                          key={item.id}
                          software={item}
                          onDelete={handleDeleteClick}
                          viewMode="list"
                        />
                      ))}

                      {totalSoftware > 3 && (
                        <div className="text-center pt-4">
                          <Button
                            variant="outline"
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                          >
                            View All Software ({totalSoftware})
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Popular software by category */}
              {!isLoading && software && software.length > 0 && (
                <Card className="bg-slate-900/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-slate-100">
                      Software by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(
                        software.reduce((acc, item) => {
                          const categoryName =
                            item.category?.name || "Uncategorized";
                          if (!acc[categoryName]) {
                            acc[categoryName] = { count: 0, totalPrice: 0 };
                          }
                          acc[categoryName].count += 1;
                          acc[categoryName].totalPrice += item.price;
                          return acc;
                        }, {} as Record<string, { count: number; totalPrice: number }>)
                      )
                        .sort((a, b) => b[1].count - a[1].count)
                        .slice(0, 4)
                        .map(([categoryName, stats], index) => (
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
                                  {categoryName}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {stats.count}{" "}
                                  {stats.count === 1 ? "item" : "items"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-100">
                                ${formatNumber(stats.totalPrice)}
                              </p>
                              <p className="text-xs text-green-400">Revenue</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteSoftware.isPending}
        itemName={softwareToDelete?.name}
      />
    </div>
  );
}
