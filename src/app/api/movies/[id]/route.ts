import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const movie = await prisma.movie.findFirst({
      where: {
        id: params.id,
        user: { clerkId: userId },
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if movie belongs to user
    const existingMovie = await prisma.movie.findFirst({
      where: {
        id: params.id,
        user: { clerkId: userId },
      },
    });

    if (!existingMovie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
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

    const movie = await prisma.movie.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(genre && { genre }),
        ...(rating !== undefined && {
          rating: rating ? parseFloat(rating) : null,
        }),
        ...(releaseDate && { releaseDate: new Date(releaseDate) }),
        ...(posterUrl !== undefined && { posterUrl }),
        ...(director !== undefined && { director }),
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error("Error updating movie:", error);
    return NextResponse.json(
      { error: "Failed to update movie" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if movie belongs to user
    const movie = await prisma.movie.findFirst({
      where: {
        id: params.id,
        user: { clerkId: userId },
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    await prisma.movie.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json(
      { error: "Failed to delete movie" },
      { status: 500 }
    );
  }
}
