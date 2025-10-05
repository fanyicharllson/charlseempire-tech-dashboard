import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { deleteImage } from "@/lib/cloudinary";

// DELETE: Delete software by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized! Please login to perform this action." }, { status: 401 });
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
        console.warn("Failed to delete image from Cloudinary, but continuing with database deletion");
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
