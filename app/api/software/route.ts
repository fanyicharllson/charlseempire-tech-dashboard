/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { softwareSchema } from "@/lib/validations";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// POST: Create new software
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized! Please login to perform this action." }, { status: 401 });
    }

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

    // Upload image to Cloudinary
    let imageUrl = "";
    if (validated.image) {
      const bytes = await validated.image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "charlesempire-software-dashboard" },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      imageUrl = result.secure_url;
    }

    // Generate slug
    const slug = generateSlug(validated.name);

    // Find category by slug to get the actual category ID
    const category = await db.category.findUnique({
      where: { slug: validated.category },
    });

    if (!category) {
      return NextResponse.json(
        { error: `Category '${validated.category}' not found` },
        { status: 400 }
      );
    }

    // Create software in database
    const software = await db.software.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description,
        version: validated.version,
        platform: validated.platform,
        price: parseFloat(validated.price),
        imageUrl,
        downloadUrl: "", // Will be added later
        categoryId: category.id, // Use the actual category ID
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(software, { status: 201 });
  } catch (error: any) {
    console.error("Software creation error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create software" },
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
