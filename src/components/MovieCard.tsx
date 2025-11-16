"use client";

import { Movie } from "@/types/movie";
import Link from "next/link";
import { useState } from "react";

interface MovieCardProps {
  movie: Movie;
  onDelete: (id: string) => Promise<void>;
}

export default function MovieCard({ movie, onDelete }: MovieCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this movie?")) {
      setIsDeleting(true);
      try {
        await onDelete(movie.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg overflow-hidden hover:shadow-xl dark:hover:shadow-xl transition-all hover:scale-105 transform">
      {movie.posterUrl && (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 dark:text-white">{movie.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{movie.genre}</p>

        {movie.director && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Director: {movie.director}
          </p>
        )}

        {movie.rating && (
          <p className="text-yellow-500 dark:text-yellow-400 font-semibold mb-2">
            ★ {movie.rating}/10
          </p>
        )}

        {movie.description && (
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {movie.description}
          </p>
        )}

        <div className="flex gap-2 mt-4">
          <Link
            href={`/movies/${movie.id}`}
            className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 px-3 rounded text-center text-sm font-semibold transition"
          >
            View
          </Link>
          <Link
            href={`/movies/${movie.id}/edit`}
            className="flex-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white py-2 px-3 rounded text-center text-sm font-semibold transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-3 rounded text-sm font-semibold transition"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
