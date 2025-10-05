import { z } from "zod";

// Software validation schema
export const softwareSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(
      1000,
      "Description too long! please your description must be less than 1000 characters"
    ),
  version: z
    .string()
    .min(1, "Version is required")
    .regex(/^\d+\.\d+(\.\d+)?$/, "Invalid version format (use 1.0.0)"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a positive number",
  }),
  platform: z.array(z.string()).min(1, "Select at least one platform"),
  image: z
    .union([
      z.instanceof(File),
      z.string().length(0), // Accept empty string
      z.null(),
    ])
    .optional()
    .transform((val) => {
      // Convert empty string to undefined
      if (typeof val === "string" && val === "") return undefined;
      if (!val) return undefined;
      return val as File;
    })
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Image must be less than 5MB"
    )
    .refine(
      (file) =>
        !file ||
        ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
          file.type
        ),
      "Only PNG, JPG, or WEBP images are allowed"
    ),
});

export type SoftwareFormData = z.infer<typeof softwareSchema>;

// Category validation schema
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
