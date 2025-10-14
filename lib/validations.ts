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
  webUrl: z
    .string()
    .optional()
    .transform((val) => val === "" ? undefined : val)
    .pipe(z.string().url("Please enter a valid URL").optional()),
  tags: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return [];
      const processed = val.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
      return processed;
    }),
  repoUrl: z
    .string()
    .optional()
    .transform((val) => val === "" ? undefined : val)
    .pipe(z.string().url("Please enter a valid repository URL").optional()),
  downloadUrl: z
    .string()
    .optional()
    .transform((val) => val === "" ? undefined : val)
    .pipe(z.string().url("Please enter a valid download URL").optional()),
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

// Form input type (before validation transforms)
export type SoftwareFormData = {
  name: string;
  description: string;
  version: string;
  category: string;
  price: string;
  platform: string[];
  webUrl?: string;
  tags?: string; // This is a string in the form, gets transformed to string[] for API
  repoUrl?: string;
  downloadUrl?: string;
  image?: File;
};

// API data type (after validation transforms)
export type SoftwareValidatedData = z.infer<typeof softwareSchema> & {
  tags: string[]; // Always an array after validation
};

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
