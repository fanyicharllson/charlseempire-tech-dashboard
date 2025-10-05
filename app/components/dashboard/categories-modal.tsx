"use client";

import { useEffect } from "react";
import { Loader2, FolderPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { categorySchema, type CategoryFormData } from "@/lib/validations";
import { Category } from "@/types/categories";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormData) => void;
  isLoading: boolean;
  category?: Category | null;
}

export function CategoryModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  category,
}: CategoryModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nameValue = watch("name");

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("slug", category.slug);
    } else {
      reset();
    }
  }, [category, setValue, reset]);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);

    if (!category) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug);
    }
  };

  const handleFormSubmit = (data: CategoryFormData) => {
    onSubmit(data);
    if (!category) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <FolderPlus className="h-6 w-6 text-blue-500" />
            </div>
            <DialogTitle className="text-xl text-slate-100">
              {category ? "Edit Category" : "Create Category"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            {category
              ? "Update the category details"
              : "Add a new category for organizing software"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 mt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">
              Category Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., Productivity"
              {...register("name")}
              onChange={handleNameChange}
              className="bg-slate-800 border-slate-700 text-slate-100"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-400 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-slate-300">
              Slug *
            </Label>
            <Input
              id="slug"
              placeholder="e.g., productivity"
              {...register("slug")}
              className="bg-slate-800 border-slate-700 text-slate-100"
              disabled={isLoading}
            />
            <p className="text-xs text-slate-500">
              URL-friendly identifier (lowercase, hyphens only)
            </p>
            {errors.slug && (
              <p className="text-red-400 text-xs">{errors.slug.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-6">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="border-red-600 bg-red-600 text-white hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {category ? "Updating..." : "Creating..."}
                </>
              ) : category ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
