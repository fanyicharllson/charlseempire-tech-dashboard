/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";
import { useCreateSoftware, useUpdateSoftware } from "@/hooks/use-software";
import { softwareSchema, type SoftwareFormData } from "@/lib/validations";
import type { Software } from "@/types/software";
import Image from "next/image";
import { useCategories } from "@/hooks/use-category";
import { useUser } from "@clerk/nextjs";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  software?: Software | null;
}

export function UploadModal({
  open,
  onOpenChange,
  software,
}: UploadModalProps) {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
    const { user } = useUser();
  

  const createSoftware = useCreateSoftware();
  const updateSoftware = useUpdateSoftware();
  const { data: categories } = useCategories();

  const isEditing = !!software;
  const isLoading = createSoftware.isPending || updateSoftware.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SoftwareFormData>({
    resolver: zodResolver(softwareSchema),
    defaultValues: {
      platform: [],
      webUrl: "",
      tags: "",
      repoUrl: "",
      downloadUrl: "",
    },
  });

  const platform = watch("platform");

  // Pre-fill form when editing
  useEffect(() => {
    if (software && open) {
      setValue("name", software.name);
      setValue("description", software.description);
      setValue("version", software.version || "");
      setValue("category", software.categoryId);
      setValue("price", software.price.toString());
      setValue("platform", software.platform);
      setValue("webUrl", software.webUrl || "");
      setValue("tags", software.tags?.join(", ") || "");
      setValue("repoUrl", software.repoUrl || "");
      setValue("downloadUrl", software.downloadUrl || "");
      setImagePreview(software.imageUrl);
      setImageFile(null);
    } else if (!open) {
      reset();
      setImageFile(null);
      setImagePreview("");
    }
  }, [software, open, setValue, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPEG, PNG, or WebP image.",
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }

      setImageFile(file);
      setValue("image", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SoftwareFormData) => {
    try {
      if (isEditing) {
        await updateSoftware.mutateAsync({
          id: software.id,
          data: {
            name: data.name,
            description: data.description,
            version: data.version,
            category: data.category,
            price: data.price,
            platform: data.platform,
            webUrl: data.webUrl,
            tags: data.tags,
            repoUrl: data.repoUrl,
            downloadUrl: data.downloadUrl,
            image: imageFile || undefined,
          },
        });

        toast({
          title:  `Updated 🎉 ${user?.firstName || ""}!`,
          description: `${data.name} updated successfully!`,
          className: "bg-blue-500 text-white",
        });
      } else {
        await createSoftware.mutateAsync({
          name: data.name,
          description: data.description,
          version: data.version,
          category: data.category,
          price: data.price,
          platform: data.platform,
          webUrl: data.webUrl,
          tags: data.tags,
          repoUrl: data.repoUrl,
          downloadUrl: data.downloadUrl,
          image: imageFile || undefined,
        });

        toast({
          title: `Success 🎉 ${user?.firstName || ""}!`,
          description: `${data.name} uploaded successfully!`,
          className: "bg-blue-500 text-white",
        });
      }

      reset();
      setImageFile(null);
      setImagePreview("");
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: `Error 😥 ${user?.firstName || ""}!`,
        description:
          error.message ||
          `Failed to ${isEditing ? "update" : "upload"} software`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] bg-slate-900 border-slate-700 text-slate-100 flex flex-col"
        onPointerDownOutside={isLoading ? (e) => e.preventDefault() : undefined}
        onEscapeKeyDown={isLoading ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-blue-400">
            {isLoading
              ? isEditing
                ? "Updating Software..."
                : "Uploading Software..."
              : isEditing
              ? "Edit Software"
              : "Upload New Software"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isLoading
              ? "Please wait while we process your request. Do not close this window."
              : isEditing
              ? "Update the software details below"
              : "Fill in the details to add new software to your library"}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto pr-2 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-3" />
                <p className="text-slate-100 font-medium">
                  {isEditing ? "Updating Software..." : "Uploading Software..."}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Please wait, do not close this window
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Software Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter software name"
                  {...register("name")}
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="version" className="text-slate-300">
                  Version *
                </Label>
                <Input
                  id="version"
                  placeholder="e.g., 1.0.0"
                  {...register("version")}
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
                {errors.version && (
                  <p className="text-red-400 text-xs">
                    {errors.version.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the software..."
                {...register("description")}
                className="bg-slate-800 border-slate-700 text-slate-100 min-h-[100px]"
              />
              {errors.description && (
                <p className="text-red-400 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-300">
                  Category *
                </Label>
                <Select
                  onValueChange={(value) => setValue("category", value)}
                  defaultValue={software?.categoryId}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {categories?.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                        className="text-white cursor-pointer"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-400 text-xs">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-slate-300">
                  Price (USD) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0 for free"
                  {...register("price")}
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
                {errors.price && (
                  <p className="text-red-400 text-xs">{errors.price.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Platform *</Label>
              <div className="flex gap-4">
                {["Windows", "Mac", "Linux"].map((p) => (
                  <label
                    key={p}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={platform.includes(p)}
                      onChange={(e) => {
                        const newPlatforms = e.target.checked
                          ? [...platform, p]
                          : platform.filter((item) => item !== p);
                        setValue("platform", newPlatforms);
                      }}
                      className="rounded border-slate-700 bg-slate-800"
                    />
                    <span className="text-sm text-slate-300">{p}</span>
                  </label>
                ))}
              </div>
              {errors.platform && (
                <p className="text-red-400 text-xs">
                  {errors.platform.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="webUrl" className="text-slate-300">
                  Website URL
                </Label>
                <Input
                  id="webUrl"
                  placeholder="https://example.com"
                  {...register("webUrl")}
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
                {errors.webUrl && (
                  <p className="text-red-400 text-xs">
                    {errors.webUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="repoUrl" className="text-slate-300">
                  Repository URL
                </Label>
                <Input
                  id="repoUrl"
                  placeholder="https://github.com/username/repo"
                  {...register("repoUrl")}
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
                {errors.repoUrl && (
                  <p className="text-red-400 text-xs">
                    {errors.repoUrl.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="downloadUrl" className="text-slate-300">
                  Download URL
                </Label>
                <Input
                  id="downloadUrl"
                  placeholder="https://example.com/download"
                  {...register("downloadUrl")}
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
                {errors.downloadUrl && (
                  <p className="text-red-400 text-xs">
                    {errors.downloadUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-slate-300">
                  Programming Languages
                </Label>
                <Input
                  id="tags"
                  placeholder="java, python, javascript (comma-separated)"
                  {...register("tags")}
                  className="bg-slate-800 border-slate-700 text-slate-100"
                />
                {errors.tags && (
                  <p className="text-red-400 text-xs">{errors.tags.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">
                Software Image *{" "}
                {isEditing && "(Leave empty to keep current image)"}
              </Label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer block"
              >
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-32 mx-auto rounded"
                      width={500}
                      height={128}
                    />
                    {isEditing && !imageFile && (
                      <p className="text-xs text-slate-500 mt-2">
                        Click to change image
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </>
                )}
              </label>
              {errors.image && (
                <p className="text-red-400 text-xs">{errors.image.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="text-red-500"
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
                    {isEditing ? "Updating..." : "Uploading..."}
                  </>
                ) : isEditing ? (
                  "Update Software"
                ) : (
                  "Upload Software"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
