"use client";

import { Movie } from "@/types/movie";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MovieDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        ) : !movie ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-lg">Movie not found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
              {movie.posterUrl && (
                <div>
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

                <div className="space-y-4 mb-6">
                  <p className="text-gray-600">
                    <span className="font-semibold">Genre:</span> {movie.genre}
                  </p>

                  {movie.director && (
                    <p className="text-gray-600">
                      <span className="font-semibold">Director:</span>{" "}
                      {movie.director}
                    </p>
                  )}

                  {movie.rating && (
                    <p className="text-gray-600">
                      <span className="font-semibold">Rating:</span>{" "}
                      <span className="text-yellow-500 text-lg">
                        ★ {movie.rating}/10
                      </span>
                    </p>
                  )}

                  {movie.releaseDate && (
                    <p className="text-gray-600">
                      <span className="font-semibold">Release Date:</span>{" "}
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {movie.description && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {movie.description}
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Link
                    href={`/movies/${movie.id}/edit`}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold"
                  >
                    Edit Movie
                  </Link>
                  <Link
                    href="/movies"
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded font-semibold"
                  >
                    Back to List
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
