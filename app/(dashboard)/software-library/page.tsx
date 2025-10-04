/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Grid3x3, List, Loader2, Package } from "lucide-react";
import { DashboardHeader } from "@/app/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { SoftwareCard } from "@/app/components/dashboard/software-card";
import { DeleteModal } from "@/app/components/dashboard/delete-modal";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useSoftware, useDeleteSoftware } from "@/hooks/use-software";
import { useToast } from "@/app/components/ui/use-toast";
import type { Software } from "@/types/software";

export default function SoftwareLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [softwareToDelete, setSoftwareToDelete] = useState<Software | null>(
    null
  );

  const { toast } = useToast();
  const { data: software, isLoading, isError, error } = useSoftware();
  const deleteSoftware = useDeleteSoftware();

  // Get unique categories from software
  const categories = useMemo(() => {
    if (!software) return [];
    const uniqueCategories = new Set(
      software.map((s) => s.category?.name).filter(Boolean)
    );
    return Array.from(uniqueCategories);
  }, [software]);

  // Filter software
  const filteredSoftware = useMemo(() => {
    if (!software) return [];

    return software.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        item.category?.name?.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [software, searchQuery, categoryFilter]);

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
        title: "Deleted!",
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
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-3">
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-slate-100">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={(category ?? "").toLowerCase()}
                        >
                          {category}
                        </SelectItem>
                      ))}
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

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                  <p className="text-slate-400">Loading software library...</p>
                </div>
              )}

              {/* Error State */}
              {isError && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                    <Package className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">
                    Failed to load software
                  </h3>
                  <p className="text-slate-500 mb-4">
                    {error?.message || "Please try again"}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* Results Count */}
              {!isLoading && !isError && software && (
                <div className="text-sm text-slate-400">
                  Showing {filteredSoftware.length} of {software.length}{" "}
                  software
                </div>
              )}

              {/* Software Grid/List */}
              {!isLoading && !isError && filteredSoftware.length > 0 && (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "flex flex-col gap-4"
                  }
                >
                  {filteredSoftware.map((item) => (
                    <SoftwareCard
                      key={item.id}
                      software={item}
                      viewMode={viewMode}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              )}

              {/* Empty State - No Results */}
              {!isLoading &&
                !isError &&
                software &&
                filteredSoftware.length === 0 &&
                software.length > 0 && (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
                      <Search className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">
                      No software found
                    </h3>
                    <p className="text-slate-500 mb-4">
                      Try adjusting your search or filters
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setCategoryFilter("all");
                      }}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}

              {/* Empty State - No Software */}
              {!isLoading && !isError && software && software.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
                    <Package className="h-8 w-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">
                    No software yet
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Start by uploading your first software
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/dashboard")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
