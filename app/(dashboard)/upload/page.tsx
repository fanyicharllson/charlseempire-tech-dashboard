/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { DashboardHeader } from "@/app/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useToast } from "@/app/components/ui/use-toast";
import { useCreateSoftware } from "@/hooks/use-software";
import { useForm } from "react-hook-form";
import { SoftwareFormData, softwareSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function UploadPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const createSoftware = useCreateSoftware();

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
    },
  });

  const platform = watch("platform");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setValue("image", file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SoftwareFormData) => {
    try {
      await createSoftware.mutateAsync({
        name: data.name,
        description: data.description,
        version: data.version,
        category: data.category,
        price: data.price,
        platform: data.platform,
        image: imageFile || undefined,
      });

      toast({
        title: `Success 🎉 ${user?.firstName || ""}!`,
        description: `${data.name} uploaded successfully!`,
        className: "bg-blue-500 text-white",
      });

      // Reset form and close modal
      reset();
      setImageFile(null);
      setImagePreview("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload software",
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
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Page Header */}
              <div>
                <h1 className="text-3xl font-bold text-blue-400 mb-2">
                  Upload Software
                </h1>
                <p className="text-slate-400">
                  Add new software to your library
                </p>
              </div>

              {/* Upload Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <p className="text-red-400 text-xs">
                        {errors.name.message}
                      </p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-slate-300">
                      Category *
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("category", value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem
                          value="productivity"
                          className="text-white cursor-pointer"
                        >
                          Productivity
                        </SelectItem>
                        <SelectItem
                          value="development"
                          className="text-white cursor-pointer"
                        >
                          Development
                        </SelectItem>
                        <SelectItem
                          value="design"
                          className="text-white cursor-pointer"
                        >
                          Design
                        </SelectItem>
                        <SelectItem
                          value="utilities"
                          className="text-white cursor-pointer"
                        >
                          Utilities
                        </SelectItem>
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
                      Price (USD)
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
                      <p className="text-red-400 text-xs">
                        {errors.price.message}
                      </p>
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

                <div className="space-y-2">
                  <Label className="text-slate-300">Software Image *</Label>
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
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-32 mx-auto rounded"
                        width={500}
                        height={200} //! Check this again
                      />
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
                    <p className="text-red-400 text-xs">
                      {errors.image.message}
                    </p>
                  )}
                </div>

                {/* <div className="space-y-2">
                  <Label className="text-slate-300">Download File *</Label>
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <Upload className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                    <p className="text-sm text-slate-400 mb-1">
                      Click to upload software file
                    </p>
                    <p className="text-xs text-slate-500">
                      ZIP, EXE, DMG, etc. (Max 500MB)
                    </p>
                  </div>
                </div> */}

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={true}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent disabled:cursor-not-allowed"
                    title="Save to draft coming soon!"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    type="submit"
                    disabled={createSoftware.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {createSoftware.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading please wait...
                      </>
                    ) : (
                      <div className="flex items-center">
                        <Upload className="mr-2 h-4 w-4 text-white" />
                        <span>Upload Software</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
