"use client";

import MovieForm from "@/components/MovieForm";
import { Movie, MovieFormData } from "@/types/movie";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditMoviePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await fetch(`/api/movies/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMovie(data);
      }
    } catch (error) {
      console.error("Failed to fetch movie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: MovieFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push(`/movies/${id}`);
      } else {
        alert("Failed to update movie");
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      alert("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            🎬 Movie Manager
          </Link>
          <Link
            href="/movies"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
          >
            ← Back to Movies
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        ) : !movie ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-lg">Movie not found</p>
          </div>
        ) : (
          <MovieForm
            movie={movie}
            onSubmit={handleSubmit}
            isLoading={isSaving}
          />
        )}
      </main>
    </>
  );
}
