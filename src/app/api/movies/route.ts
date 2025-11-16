import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const movies = await prisma.movie.findMany({
      where: { user: { clerkId: userId } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      genre,
      rating,
      releaseDate,
      posterUrl,
      director,
    } = body;

    // Validate required fields
    if (!title || !genre) {
      return NextResponse.json(
        { error: "Title and genre are required" },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { clerkId: userId, email: "" },
      });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        genre,
        rating: rating ? parseFloat(rating) : undefined,
        releaseDate: releaseDate ? new Date(releaseDate) : undefined,
        posterUrl,
        director,
        userId: user.id,
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error("Error creating movie:", error);
    return NextResponse.json(
      { error: "Failed to create movie" },
      { status: 500 }
    );
  }
}
