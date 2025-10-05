/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { softwareSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/generate-slug";

//! DELETE: Delete software by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized! Please login to perform this action." },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if software exists
    const software = await db.software.findUnique({
      where: { id },
    });

    if (!software) {
      return NextResponse.json(
        { error: "Software not found" },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if exists
    if (software.imageUrl) {
      const deleted = await deleteImage(software.imageUrl);
      if (deleted) {
        console.log("Successfully deleted image from Cloudinary! 😎");
      } else {
        console.warn(
          "Failed to delete image from Cloudinary, but continuing with database deletion"
        );
      }
    }

    // Delete the software from database
    await db.software.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Software deleted successfully" });
  } catch (error) {
    console.error("Delete software error:", error);
    return NextResponse.json(
      { error: "Failed to delete software" },
      { status: 500 }
    );
  }
}

//! GET: Fetch single software by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const software = await db.software.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!software) {
      return NextResponse.json(
        { error: "Software not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(software);
  } catch (error) {
    console.error("Fetch software error:", error);
    return NextResponse.json(
      { error: "Failed to fetch software" },
      { status: 500 }
    );
  }
}

//!PUT: Update sofyware
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized! Please login to perform this action" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const formData = await request.formData();
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      version: formData.get("version") as string,
      category: formData.get("category") as string,
      price: formData.get("price") as string,
      platform: JSON.parse(formData.get("platform") as string) as string[],
      image: formData.get("image") as File | null,
    };

    // Validate data
    const validated = softwareSchema.parse(data);

    // Get existing software
    const existing = await db.software.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Software not found! please create a software first!" },
        { status: 404 }
      );
    }

    let imageUrl = existing.imageUrl;

    // Upload new image if provided
    if (validated.image) {
      try {
        const uploadResult = await uploadImage(validated.image, {
          folder: "charlesempire-software-dashboard",
          maxWidth: 800,
          maxHeight: 600,
          quality: "auto:good",
          timeout: 60000,
        });

        // Delete old image from Cloudinary if upload successful
        if (existing.imageUrl) {
          console.log(`cleaning up existing image: ${existing.imageUrl}`);
          try {
            await deleteImage(existing.imageUrl);
            console.log("✅Existing Image cleanup completed successfully");
          } catch (cleanupError) {
            console.error("❌ Failed to cleanup image:", cleanupError);
          }
        }

        imageUrl = uploadResult;
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

    // Generate new slug if name changed
    const slug =
      validated.name !== existing.name
        ? generateSlug(validated.name)
        : existing.slug;

    // Update software
    const software = await db.software.update({
      where: { id },
      data: {
        name: validated.name,
        slug,
        description: validated.description,
        version: validated.version,
        platform: validated.platform,
        price: parseFloat(validated.price),
        imageUrl,
        downloadUrl: "",
        categoryId: validated.category,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(software);
  } catch (error: any) {
    console.error("Update software error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update software" },
      { status: 500 }
    );
  }
}
