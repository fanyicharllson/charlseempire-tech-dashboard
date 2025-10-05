/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";

// GET: Fetch all categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { software: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST: Create new category
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized! Please login to perform action." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = categorySchema.parse(body);

    // Check if category already exists
    const existing = await db.category.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "Category with this slug already exists. Please create another!",
        },
        { status: 400 }
      );
    }

    const category = await db.category.create({
      data: validated,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("Create category error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          error:
            "Validation failed! Please ensure you inputed the right values in the fields.",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create category! Please try again later." },
      { status: 500 }
    );
  }
}
