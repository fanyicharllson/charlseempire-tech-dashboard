/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { FolderPlus, Loader2, Edit, Trash2, Package } from "lucide-react";
import { DashboardHeader } from "@/app/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { DeleteModal } from "@/app/components/dashboard/delete-modal";
import { useToast } from "@/app/components/ui/use-toast";
import { formatRelativeTime } from "@/lib/utils";
import type { CategoryFormData } from "@/lib/validations";
import { Category } from "@/types/categories";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/use-category";
import { CategoryModal } from "@/app/components/dashboard/categories-modal";

export default function CategoryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const { toast } = useToast();
  const { data: categories, isLoading, isError, error } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleCreate = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      if (selectedCategory) {
        await updateCategory.mutateAsync({
          id: selectedCategory.id,
          data,
        });
        toast({
          title: "Updated!",
          description: `${data.name} has been updated successfully`,
          className: "bg-green-500 text-white",
        });
      } else {
        await createCategory.mutateAsync(data);
        toast({
          title: "Created!",
          description: `${data.name} has been created successfully`,
          className: "bg-green-500 text-white",
        });
      }
      setModalOpen(false);
      setSelectedCategory(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory.mutateAsync(categoryToDelete.id);
      toast({
        title: "Deleted!",
        description: `${categoryToDelete.name} has been removed successfully`,
        className: "bg-green-500 text-white",
      });
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
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

          <main className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="space-y-6">
              {/* Header */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-2xl text-blue-400">
                      Software Categories
                    </CardTitle>
                    <p className="text-slate-400 text-sm mt-1">
                      Manage and organize your software categories
                    </p>
                  </div>
                  <Button
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Category
                  </Button>
                </CardHeader>
              </Card>

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                  <p className="text-slate-400">Loading categories...</p>
                </div>
              )}

              {/* Error State */}
              {isError && (
                <Card className="bg-slate-900/50 border-slate-700/50">
                  <CardContent className="py-20">
                    <div className="text-center">
                      <p className="text-red-400 mb-2">
                        Failed to load categories
                      </p>
                      <p className="text-sm text-slate-500">
                        {error?.message || "Please try again"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Categories Grid */}
              {!isLoading &&
                !isError &&
                categories &&
                categories.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <Card
                        key={category.id}
                        className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/50 transition-colors"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Package className="h-6 w-6 text-blue-500" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-100 text-lg">
                                  {category.name}
                                </h3>
                                <p className="text-xs text-slate-500">
                                  /{category.slug}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="text-slate-400">
                              <span className="font-medium text-blue-400">
                                {category._count?.software || 0}
                              </span>{" "}
                              software
                            </div>
                            <div className="text-xs text-slate-500">
                              {formatRelativeTime(category.createdAt)}
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
                            <Button
                              size="sm"
                              onClick={() => handleEdit(category)}
                              className="flex-1 bg-blue-500 border-blue-700 text-slate-300 hover:bg-blue-800"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDeleteClick(category)}
                              disabled={
                                category._count && category._count.software > 0
                              }
                              className="flex-1 border-red-600 bg-red-600 text-white hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>

                          {category._count && category._count.software > 0 && (
                            <p className="text-xs text-amber-400 mt-2 text-center">
                              Remove software first to delete
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

              {/* Empty State */}
              {!isLoading &&
                !isError &&
                categories &&
                categories.length === 0 && (
                  <Card className="bg-slate-900/50 border-slate-700/50">
                    <CardContent className="py-20">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
                          <FolderPlus className="h-8 w-8 text-slate-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-300 mb-2">
                          No categories yet
                        </h3>
                        <p className="text-slate-500 mb-6">
                          Create your first category to organize software
                        </p>
                        <Button
                          onClick={handleCreate}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <FolderPlus className="h-4 w-4 mr-2" />
                          Create Category
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>
          </main>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
        isLoading={createCategory.isPending || updateCategory.isPending}
        category={selectedCategory}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteCategory.isPending}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        itemName={categoryToDelete?.name}
      />
    </div>
  );
}
