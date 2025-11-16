"use client";

import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types/movie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch("/api/movies");
      if (response.ok) {
        const data = await response.json();
        setMovies(data);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMovies(movies.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete movie:", error);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            🎬 MovieDb
          </Link>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            <Link
              href="/movies/new"
              className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
            >
              + Add Movie
            </Link>
          </div>
        </div>
      </nav>

      <main className="bg-white dark:bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold dark:text-white">My Movies</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{movies.length} movies in your collection</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Loading your movies...</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No movies yet</p>
              <Link
                href="/movies/new"
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-2 rounded inline-block font-semibold transition"
              >
                Add your first movie
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
