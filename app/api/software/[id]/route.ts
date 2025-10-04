import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: Extract public_id from Cloudinary URL
function getPublicIdFromUrl(url: string): string | null {
  try {
    const matches = url.match(/\/([^/]+)\.[^.]+$/);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
}

// DELETE: Delete software by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      const publicId = getPublicIdFromUrl(software.imageUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(
            `charlesempire-software-dashboard/${publicId}`
          );
          console.log("Deleted image from cloudinary!😎");
        } catch (error) {
          console.error("Failed to delete from Cloudinary:", error);
          // Continue with database deletion even if Cloudinary fails
        }
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

// GET: Fetch single software by ID
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
