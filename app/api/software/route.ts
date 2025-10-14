/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { softwareSchema } from "@/lib/validations";
import { uploadImage, cleanupImage } from "@/lib/cloudinary";
import { generateSlug } from "@/lib/generate-slug";


// POST: Create new software
export async function POST(request: Request) {
  let imageUrl = ""; 
  
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized! Please login to perform this action." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      version: formData.get("version") as string,
      category: formData.get("category") as string,
      price: formData.get("price") as string,
      platform: JSON.parse(formData.get("platform") as string) as string[],
      webUrl: formData.get("webUrl") as string || undefined,
      tags: formData.get("tags") as string || "",
      repoUrl: formData.get("repoUrl") as string || undefined,
      downloadUrl: formData.get("downloadUrl") as string || undefined,
      image: formData.get("image") as File | null,
    };

    // Validate data
    const validated = softwareSchema.parse(data);

   

    // Upload image to Cloudinary
    if (validated.image) {
      try {
        imageUrl = await uploadImage(validated.image, {
          folder: "charlesempire-software-dashboard",
          maxWidth: 800,
          maxHeight: 600,
          quality: "auto:good",
          timeout: 60000,
        });
      } catch (uploadError: any) {
        return NextResponse.json(
          {
            error:
              uploadError.message ||
              "Failed to upload image. Please try again.",
          },
          { status: 500 }
        );
      }
    }

    // Generate slug
    const slug = generateSlug(validated.name);

    // Find category by ID to verify it exists
    const category = await db.category.findUnique({
      where: { id: validated.category },
    });

    if (!category) {
      return NextResponse.json(
        { error: `Category with ID '${validated.category}' not found! Please select another category` },
        { status: 400 }
      );
    }
   
    
    const software = await db.software.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description,
        version: validated.version,
        platform: validated.platform,
        price: parseFloat(validated.price),
        imageUrl,
        downloadUrl: validated.downloadUrl || "",
        webUrl: validated.webUrl,
        tags: validated.tags || [], // Ensure it's always an array
        repoUrl: validated.repoUrl,
        categoryId: validated.category, // Use the category ID directly
      },
      include: {
        category: true,
      },
    });
    

    return NextResponse.json(software, { status: 201 });
  } catch (error: any) {
    console.error("Software creation error:", error);

    // Cleanup uploaded image if database operation failed
    if (imageUrl) {
      console.log(`Database operation failed, cleaning up uploaded image: ${imageUrl}`);
      try {
        await cleanupImage(imageUrl);
        console.log("✅ Image cleanup completed successfully");
      } catch (cleanupError) {
        console.error("❌ Failed to cleanup image:", cleanupError);
      }
    } else {
      console.log("No image to cleanup (imageUrl is empty)");
    }

    // Handle Zod validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    // Handle Cloudinary timeout specifically
    if (error.message?.includes("Request Timeout") || error.http_code === 499) {
      return NextResponse.json(
        {
          error:
            "Image upload timed out. Please try with a smaller image or check your connection.",
        },
        { status: 408 }
      );
    }

    // Handle database errors
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error:
            "Software with this name already exists! Please try another name.",
        },
        { status: 409 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: "Failed to create software. Please try again." },
      { status: 500 }
    );
  }
}

// GET: Fetch all software
export async function GET() {
  try {
    const software = await db.software.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(software);
  } catch (error) {
    console.error("Fetch software error:", error);
    return NextResponse.json(
      { error: "Failed to fetch software" },
      { status: 500 }
    );
  }
}
