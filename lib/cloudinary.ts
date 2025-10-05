/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (singleton pattern)
if (!cloudinary.config().cloud_name) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Extract public_id from Cloudinary URL
 * @param url - Cloudinary image URL
 * @returns public_id or null if extraction fails
 */
export function getPublicIdFromUrl(url: string): string | null {
  try {
    console.log(`🔍 Extracting public_id from URL: ${url}`);

    // Handle different Cloudinary URL formats
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.ext
    // Format: https://res.cloudinary.com/cloud_name/image/upload/folder/filename.ext

    let matches;

    // Try with version number first
    matches = url.match(/\/upload\/v\d+\/(.+?)(?:\.[^.]*)?$/);
    if (matches && matches[1]) {
      console.log(`✅ Extracted public_id (with version): ${matches[1]}`);
      return matches[1];
    }

    // Try without version number
    matches = url.match(/\/upload\/(.+?)(?:\.[^.]*)?$/);
    if (matches && matches[1]) {
      console.log(`✅ Extracted public_id (without version): ${matches[1]}`);
      return matches[1];
    }

    console.warn(`❌ Could not extract public_id from URL: ${url}`);
    return null;
  } catch (error) {
    console.error(`❌ Error extracting public_id from URL: ${url}`, error);
    return null;
  }
}

/**
 * Upload image to Cloudinary with optimizations
 * @param file - File to upload
 * @param options - Upload options
 * @returns Promise<string> - Secure URL of uploaded image
 */
export async function uploadImage(
  file: File,
  options: {
    folder?: string;
    maxWidth?: number;
    maxHeight?: number;
    quality?: string;
    timeout?: number;
  } = {}
): Promise<string> {
  const {
    folder = "charlesempire-software-dashboard",
    maxWidth = 800,
    maxHeight = 600,
    quality = "auto:good",
    timeout = 60000,
  } = options;

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Image file too large. Please use an image under 5MB.");
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please use JPEG, PNG, or WebP format.");
  }

  console.log("Starting image upload to Cloudinary...");

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          timeout,
          transformation: [
            { width: maxWidth, height: maxHeight, crop: "limit" },
            { quality },
            { format: "auto" },
          ],
        },
        (error: any, result: any) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload successful:", result.secure_url);
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return result.secure_url;
  } catch (error: any) {
    console.error("Image upload failed:", error);

    // Handle specific error types
    if (error.message?.includes("Request Timeout") || error.http_code === 499) {
      throw new Error(
        "Image upload timed out. Please try with a smaller image or check your connection."
      );
    }

    throw new Error("Failed to upload image. Please try again.");
  }
}

/**
 * Delete image from Cloudinary
 * @param imageUrl - Cloudinary image URL or public_id
 * @returns Promise<boolean> - Success status
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    console.log(`🗑️ Starting deletion process for: ${imageUrl}`);
    let publicId: string | null;

    // Check if it's already a public_id or a full URL
    if (imageUrl.startsWith("http")) {
      publicId = getPublicIdFromUrl(imageUrl);
    } else {
      publicId = imageUrl;
      console.log(`📝 Using provided public_id: ${publicId}`);
    }

    if (!publicId) {
      console.warn("❌ Could not extract public_id from URL:", imageUrl);
      return false;
    }

    console.log(`🔄 Attempting to delete from Cloudinary: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`📊 Cloudinary deletion result:`, result);

    if (result.result === "ok" || result.result === "not found") {
      console.log(`✅ Successfully deleted image from Cloudinary: ${publicId}`);
      return true;
    } else {
      console.warn(
        `⚠️ Unexpected deletion result: ${result.result} for ${publicId}`
      );
      return false;
    }
  } catch (error) {
    console.error("❌ Failed to delete image from Cloudinary:", error);
    return false;
  }
}

/**
 * Delete multiple images from Cloudinary
 * @param imageUrls - Array of Cloudinary image URLs
 * @returns Promise<{ success: number; failed: number }> - Deletion stats
 */
export async function deleteMultipleImages(imageUrls: string[]): Promise<{
  success: number;
  failed: number;
}> {
  let success = 0;
  let failed = 0;

  for (const url of imageUrls) {
    const result = await deleteImage(url);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  console.log(
    `Bulk deletion complete: ${success} successful, ${failed} failed`
  );
  return { success, failed };
}

/**
 * Clean up uploaded image (used for rollback scenarios)
 * @param imageUrl - Cloudinary image URL
 * @returns Promise<void>
 */
export async function cleanupImage(imageUrl: string): Promise<void> {
  try {
    await deleteImage(imageUrl);
    console.log(`Cleaned up uploaded image: ${imageUrl}`);
  } catch (error) {
    console.error("Failed to cleanup image:", error);
    // Don't throw error here, as this is typically called during error handling
  }
}

/**
 * Generate optimized image transformations for different use cases
 */
export const imageTransformations = {
  thumbnail: { width: 200, height: 200, crop: "fill" },
  medium: { width: 400, height: 300, crop: "limit" },
  large: { width: 800, height: 600, crop: "limit" },
  hero: { width: 1200, height: 800, crop: "fill" },
} as const;

/**
 * Get optimized image URL with transformations
 * @param publicId - Cloudinary public_id
 * @param transformation - Transformation preset or custom options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  transformation: keyof typeof imageTransformations | object = "medium"
): string {
  const transform =
    typeof transformation === "string"
      ? imageTransformations[transformation]
      : transformation;

  return cloudinary.url(publicId, {
    transformation: [transform, { quality: "auto", format: "auto" }],
  });
}
